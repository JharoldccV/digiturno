provider "aws" {
  region = "us-east-2"
}

resource "aws_instance" "web_server" {
  ami           = "ami-00eb69d236edcfaf8"
  instance_type = "t3.medium"
  key_name      = var.key_name

  user_data = <<-EOF
    #!/bin/bash
    # Interactuar como usuario "ubuntu" (no root)
    sudo su ubuntu
    # Actualizar el sistema
    sudo apt update -y && apt upgrade -y
    # Instalar nodejs 20
    curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    # Agregar repositorio de PHP
    sudo add-apt-repository ppa:ondrej/php -y
    # Instalar dependencias con php8.2, postgresql, composer y nodejs
    sudo apt install -y  php8.2 php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-pgsql php8.2-zip php8.2-curl php8.2-gd php8.2-mysql php8.2-intl composer postgresql nodejs
    # Instalar Yarn
    sudo npm install --global yarn
    # Habilitar y configurar Apache
    sudo systemctl start apache2
    sudo systemctl enable apache2
    # Configurar directorios para frontend y backend
    # Clonar repositorios desde GitHub
    cd /var/www
    sudo git clone ${var.github_repo} 
    sudo mv digiturno/frontend frontend
    sudo mv digiturno/backend backend
    sudo rm -rf digiturno
    # Configurar permisos
    sudo chown -R ubuntu:www-data /var/www/frontend /var/www/backend
    sudo chmod -R 775 /var/www/frontend /var/www/backend

    # Crear base de datos en PostgreSQL
    sudo -u postgres psql -c "CREATE DATABASE digiturno;"
    sudo -u postgres psql -c "CREATE USER digiturno WITH ENCRYPTED PASSWORD 'digiturno';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE digiturno TO digiturno;"


      # Configurar backend (Laravel)
    cd /var/www/backend
    sudo su ubuntu -c "composer install"
    cp .env.example .env

    # Quitar comentario de las lineas de conexión a la base de datos
    sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=pgsql/' .env
    sed -i 's/# DB_HOST=localhost/DB_HOST=localhost/' .env
    sed -i 's/# DB_PORT=3306/DB_PORT=5432/' .env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=digiturno/' .env
    sed -i 's/# DB_USERNAME=root/DB_USERNAME=digiturno/' .env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=digiturno/' .env

    php artisan key:generate
    
    # Migrar la base de datos (asegúrate que PostgreSQL esté configurado)
    php artisan migrate
    php artisan db:seed
    # Correr el backend
    php artisan serve --host=0.0.0.0 &

    # Correr el frontend

    cd /var/www/frontend
    yarn install --force
    yarn dev --host &
    
    # Configurar Virtual Host para Apache con certificado ssl Let's Encrypt

    ## Instalar certbot

    sudo apt install -y certbot python3-certbot-apache

    ## Obtener certificado

    sudo certbot --apache -d ${var.domain} --non-interactive --agree-tos --email ${var.email}

    ## Guardar configuración de Apache

    cat <<-APACHE_CONF > /etc/apache2/sites-available/digiturno.conf
    <VirtualHost *:80>
        ServerName ${var.domain}
        Redirect permanent / https://${var.domain}/
    </VirtualHost>
    <VirtualHost *:443>
        ServerName ${var.domain}

        SSLEngine on

        ProxyRequests Off
        ProxyPreserveHost On

        ProxyPass / http://localhost:5173/
        ProxyPassReverse / http://localhost:5173/

        ProxyPass /api http://localhost:8000/api/
        ProxyPassReverse /api http://localhost:8000/api/

        <Proxy *>
          Order allow,deny
          Allow from all
        </Proxy>

        Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        SSLCertificateFile /etc/letsencrypt/live/${var.domain}/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/${var.domain}/privkey.pem
        Include /etc/letsencrypt/options-ssl-apache.conf


        ErrorLog /var/log/apache2/digiturno-error.log
        CustomLog /var/log/apache2/digiturno-access.log combined
    </VirtualHost>
    APACHE_CONF

    # Habilitar el sitio y mod_rewrite
    sudo a2dissite 000-default-le-ssl.conf
    sudo a2ensite digiturno.conf
    sudo a2enmod rewrite
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo a2enmod ssl
    sudo a2enmod headers
    sudo a2enmod proxy_balancer
   
    sudo systemctl restart apache2
  EOF

  tags = {
    Name = "digiturno-web-server"
  }

  security_groups = [aws_security_group.web_server_sg.name]
}

resource "aws_security_group" "web_server_sg" {
  name_prefix = "web-server-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
