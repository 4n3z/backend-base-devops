pipeline {
    agent any

    environment {
        SONAR_URL = 'http://sonarqube:9000'
        SONARQUBE_TOKEN = credentials('sonar-token')
        NEXUS_URL = 'http://localhost:8082'
        NEXUS_CREDENTIALS = credentials('nexus-credentials')
        KUBERNETES_NAMESPACE = 'default'
        DOCKER_IMAGE = 'backend-base-devops'
        DOCKER_TAG = 'latest'
    }

    tools {
        nodejs "NodeJS"  // El nombre de la herramienta definida en Jenkins
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test -- --coverage'
            }
        }

        stage('Code Quality') {
            stages {
                stage('SonarQube Analysis') {
                    agent {
                        docker {
                            image 'sonarsource/sonar-scanner-cli'
                            args '--network="devops-infra_default"'
                            reuseNode true
                        }
                    }
                    steps {
                        withSonarQubeEnv('sonarqube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
                sh 'docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} localhost:8082/${DOCKER_IMAGE}:${DOCKER_TAG}'
            }
        }

        stage('Push to Nexus') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        // Aquí evitamos la interpolación insegura utilizando la lista de comandos
                        sh(script: 'echo $NEXUS_PASS | docker login -u $NEXUS_USER --password-stdin $NEXUS_URL', 
                           environment: [
                                "NEXUS_USER=$NEXUS_USER", 
                                "NEXUS_PASS=$NEXUS_PASS", 
                                "NEXUS_URL=$NEXUS_URL"
                           ])
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl set image deployment/backend-deployment backend=${DOCKER_IMAGE}:${DOCKER_TAG} --namespace=${KUBERNETES_NAMESPACE}'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
