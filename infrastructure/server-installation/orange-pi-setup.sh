# Change password - orange pi user
passwd

# Change to root
sudo su

# Change password - orange pi user
passwd

# Update System
apt update && apt upgrade -y

##########################################
# Docker
##########################################

# Install required packages
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker’s official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
    gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package lists again 
apt update

# Install Docker Engine
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start docker service and enable autostart
systemctl start docker
systemctl enable docker

# check if it works
docker run hello-world

# optional - add orangepi user to docker group - so you can run docker without root or sudo
usermod -aG docker orangepi


##########################################
# Static IP Address
##########################################

# Check network adapters
networkctl

# Set static IP
cat << EOF | tee /etc/systemd/network/10-static-enP3p49s0.network > /dev/null
[Match]
Name=enP3p49s0

[Network]
Address=192.168.1.100/24
Gateway=192.168.1.1
EOF

# Set dns dns servers
rm -rf /etc/resolv.conf
cat << EOF | tee /etc/resolv.conf > /dev/null
nameserver 1.1.1.1
nameserver 8.8.8.8
EOF

# start systemd-networkd
systemctl enable systemd-networkd --now

# disable old
systemctl disable NetworkManager --now
systemctl disable resolvconf.service --now

##########################################
# Cloudflare
##########################################

# Add cloudflare gpg key
mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
apt update
apt install -y cloudflared
cloudflared service install $CLOUDFLARE_TOKEN
