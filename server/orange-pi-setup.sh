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

# check network adapters
networkctl

# set configuration
cat << EOF | tee /etc/systemd/network/10-static-enP3p49s0.network > /dev/null
[Match]
Name=enP3p49s0

[Network]
Address=192.168.1.100/24
Gateway=192.168.1.1

DNS=1.1.1.1
DNS=8.8.8.8
EOF

# set dns servers
ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf

# start systemd-networkd and systemd-resolved
systemctl enable systemd-networkd --now
systemctl enable systemd-resolved --now

# disable old
systemctl disable NetworkManager --now

reboot
