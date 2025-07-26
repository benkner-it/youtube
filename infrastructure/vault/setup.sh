# start vault
# docker compose up -d vault
# docker compose logs -f vault
# apt install -y jq

export VAULT_DATA_DIR="./vault-data"
export ACME_DIR="./acme"
export SECRETS_FILE="./vault-secrets.txt"
export VAULT_CONTAINER="proxy-vault-1"

# create directories
mkdir -p "$VAULT_DATA_DIR" "$ACME_DIR"
chmod 700 "$VAULT_DATA_DIR"
chmod 755 "$ACME_DIR"

# init vault
export init_output=$(docker exec ${VAULT_CONTAINER} vault operator init -format=json)

# store Secrets
echo "$init_output" > "$SECRETS_FILE"
chmod 600 "$SECRETS_FILE"

# unseal vault
for key in $(jq -r '.unseal_keys_b64[0,1,2]' "$SECRETS_FILE"); do
    docker exec "$VAULT_CONTAINER" vault operator unseal "$key"
    echo "\n"
done


#################################
# Add PKI Engine
#################################
export root_token=$(jq -r '.root_token' "$SECRETS_FILE")


# Enable the PKI secret engine on the `/pki` mount path.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault secrets enable pki
# Tweak certificate lifespan.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault secrets tune -max-lease-ttl=8760h pki
# Generates a new self-signed root CA certificate and save it under `./root_ca.crt`.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write -field=certificate pki/root/generate/internal \
  common_name="benkner-it.internal" \
  issuer_name="root" \
  ttl=87600h > ./certs/root_ca.crt
# Configure the cluster path and AIA path (Required by the ACME feature).
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki/config/cluster \
  path=http://vault:8200/v1/pki \
  aia_path=http://vault:8200/v1/pki
# Create the role that will be used for issuing certificates from the Root CA.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki/roles/servers \
  allow_any_name=true \
  no_store=false
# Configure the issuing certificate endpoints, CRL distribution points, and OCSP server endpoints that
# will be encoded into issued certificates
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki/config/urls \
  issuing_certificates={{cluster_aia_path}}/issuer/{{issuer_id}}/der \
  crl_distribution_points={{cluster_aia_path}}/issuer/{{issuer_id}}/crl/der \
  ocsp_servers={{cluster_path}}/ocsp \
  enable_templating=true
  



# Enable the PKI secret engine on the `/pki_int` mount path.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault secrets enable -path=pki_int pki
# Tweak certificate lifespan, shorter than the root CA.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault secrets tune -max-lease-ttl=43800h pki_int
# Generate an intermediate certificate and save the CSR under `./pki_intermediate.csr`.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write -format=json pki_int/intermediate/generate/internal \
  common_name="benkner-it.internal Vault Intermediate Authority" \
  issuer_name="intermediate" \
  | jq -r '.data.csr' > ./certs/pki_intermediate.csr

  
# Sign the intermediate certificate with the root CA private key, and save the generated certificate
# under `./intermediate.cert.pem`.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write -format=json pki/root/sign-intermediate \
  issuer_ref="root" \
  csr=@/certs/pki_intermediate.csr \
  format=pem_bundle ttl="43800h" \
  | jq -r '.data.certificate' > ./certs/intermediate.cert.pem
# Imported the signed intermediate certificate.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki_int/intermediate/set-signed certificate=@/certs/intermediate.cert.pem
# Configure the cluster path and AIA path (Required by the ACME feature).
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki_int/config/cluster \
  path=http://vault:8200/v1/pki_int \
  aia_path=http://vault:8200/v1/pki_int
# Create the role that will be used for issuing certificates from the Intermediate CA.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki_int/roles/intermediate \
  issuer_ref="$(vault read -field=default pki_int/config/issuers)" \
  allow_any_name=true \
  max_ttl="720h" \
  no_store=false
# Configure the issuing certificate endpoints, CRL distribution points, and OCSP server endpoints that
# will be encoded into issued certificates.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki_int/config/urls \
  issuing_certificates={{cluster_aia_path}}/issuer/{{issuer_id}}/der \
  crl_distribution_points={{cluster_aia_path}}/issuer/{{issuer_id}}/crl/der \
  ocsp_servers={{cluster_path}}/ocsp \
  enable_templating=true
# Configure the pki_int engine so it handle ACME requests correctly.
docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault secrets tune \
  -passthrough-request-headers=If-Modified-Since \
  -allowed-response-headers=Last-Modified \
  -allowed-response-headers=Location \
  -allowed-response-headers=Replay-Nonce \
  -allowed-response-headers=Link \
  pki_int

docker exec -e VAULT_TOKEN="$root_token" "$VAULT_CONTAINER" vault write pki_int/config/acme enabled=true


