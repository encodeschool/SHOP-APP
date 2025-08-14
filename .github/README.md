# 🚀 Spring Boot CI/CD Deployment to VDS with GitHub Actions
‼️‼️‼️ <u>  First of all need to Generate SSH Keys to work with CI/CD </u>

## 1️⃣ Generate SSH Keys (if you don’t have them already)
On your local machine (not GitHub, not the VPS):
```bash
ssh-keygen -t rsa -b 4096 -C "github-cicd"
```
Press Enter for all prompts (to use default path, no passphrase).
This will create:
- Private key → ~/.ssh/id_rsa
- Public key → ~/.ssh/id_rsa.pub

## 2️⃣ Add Public Key to VDS
Log into your VDS manually (password-based for now):

```bash
ssh your_user@your_server_ip
```

Create the .ssh folder (if not already there) and set permissions:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

Append your public key to authorized_keys:

```bash
echo "PASTE_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

(Replace "PASTE_PUBLIC_KEY_CONTENT" with the full content of your id_rsa.pub.)

## 3️⃣ Test Passwordless SSH
From your local machine:
```bash
ssh -i ~/.ssh/id_rsa your_user@your_server_ip
```
If it logs in without asking for a password, you’re good.

## 4️⃣ Add Secrets in GitHub

1. Go to your GitHub repository.
2. Click Settings → Secrets and variables → Actions → New repository secret.
3. Add these secrets:

<table>
    <thead>
        <tr>
            <th>
                <td>Secret Name</td>
                <td>Value</td>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>VDS_HOST</td>
            <td>Your server IP (e.g., 123.45.67.89)</td>
        </tr>
        <tr>
            <td>VDS_USER</td>
            <td>The SSH username on your VPS (e.g., root or deploy)</td>
        </tr>
        <tr>
            <td>VDS_SSH_KEY</td>
            <td>Full content of your private key id_rsa</td>
        </tr>
    </tbody>
</table>

For example, when adding VDS_SSH_KEY:
- Open your private key:
```bash
cat ~/.ssh/id_rsa
```
- Copy all lines (including -----BEGIN OPENSSH PRIVATE KEY----- and -----END OPENSSH PRIVATE KEY-----)
- Paste it into the GitHub Secret field.

‼️‼️‼️ <u>  After setting up SSH keys you need to configure yaml file for continious deployment </u>

## Basic Requirements on the VDS
Make sure your VDS (VPS) has:
- Java JDK 17+ installed
- Maven or Gradle
- Git
- A way to run your app (systemd service, Docker, or screen/tmux)
- SSH access (with a private key from your CI/CD pipeline)

## Decide on Deployment Style
You have 2 common options:

<b>Option A – Direct Jar Deployment</b>
- CI/CD builds .jar → sends to server → restarts the service.
- Simpler, no Docker needed.
- You must manage Java versions & environment variables on VDS.

<b>Option B – Docker Deployment</b>
- CI/CD builds Docker image → pushes to registry → server pulls & restarts container.
- More portable, easier to roll back.
- Needs Docker installed on VDS.

## GitHub Actions Example (Direct Jar Deployment)
📂 .github/workflows/deploy.yml

```yaml
name: Deploy Spring Boot to VDS

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Build Jar
        run: mvn clean package -DskipTests

      - name: Deploy to VDS
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.VDS_HOST }}
          username: ${{ secrets.VDS_USER }}
          key: ${{ secrets.VDS_SSH_KEY }}
          source: "target/*.jar"
          target: "~/app"

      - name: Restart Application
        uses: appleboy/ssh-action@v0.1.8
        with:
          host: ${{ secrets.VDS_HOST }}
          username: ${{ secrets.VDS_USER }}
          key: ${{ secrets.VDS_SSH_KEY }}
          script: |
            pkill -f 'java -jar' || true
            nohup java -jar ~/app/yourapp.jar > ~/app/log.txt 2>&1 &
```

You’ll need to set these GitHub secrets:
- VDS_HOST – your server IP
- VDS_USER – SSH user
- VDS_SSH_KEY – private key to connect (add public key to ~/.ssh/authorized_keys on VDS)

## GitHub Actions Example (Docker Deployment)
📂 .github/workflows/deploy-docker.yml

```yaml 
name: Deploy Spring Boot with Docker

on:
  push:
    branches:
      - main

jobs:
  build-push-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:latest .

      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - name: Push to Docker Hub
        run: docker tag myapp:latest mydockerhubuser/myapp:latest && docker push mydockerhubuser/myapp:latest

      - name: Deploy on VDS
        uses: appleboy/ssh-action@v0.1.8
        with:
          host: ${{ secrets.VDS_HOST }}
          username: ${{ secrets.VDS_USER }}
          key: ${{ secrets.VDS_SSH_KEY }}
          script: |
            docker pull mydockerhubuser/myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 8080:8080 mydockerhubuser/myapp:latest
```

## Systemd Service (Optional for Direct Jar Deployment)
If you want your app to restart automatically after reboot:

```bash 
sudo nano /etc/systemd/system/myapp.service
```

```ini
[Unit]
Description=Spring Boot App
After=network.target

[Service]
User=myuser
ExecStart=/usr/bin/java -jar /home/myuser/app/yourapp.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

!!! Note: If you get an error in Restart Application process like: "Sudo Password is required", you need to update sudoers file:

- On your VDS, edit the sudoers file:

```bash
sudo visudo
```

- Add a line at the bottom (replace youruser with your SSH username):

```psql
youruser ALL=(ALL) NOPASSWD: /bin/systemctl restart bazaar
```
- Save and exit.

Now youruser can run:

```bash
sudo systemctl restart bazaar
```
without being prompted for a password.
