# Change password
passwd

# Change to root
sudo su

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
