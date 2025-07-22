api_addr      = "http://0.0.0.0:8200"
vault_addr    = "http://0.0.0.0:8200"
cluster_addr  = "http://0.0.0.0:8201"
cluster_name  = "my-vault-cluster"
ui            = true

storage "file" {
  path = "/vault/file"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}
