pipeline {
    agent any

    environment {
        SONAR_URL = 'http://sonarqube:9000'
        NEXUS_URL = 'http://localhost:8082'
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
                sh 'npm run test'
            }
        }

        stage('Code Quality') {
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

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${NEXUS_URL}/${DOCKER_IMAGE}:${DOCKER_TAG} .'
            }
        }

        stage('Push to Nexus') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            echo "$NEXUS_PASS" | docker login $NEXUS_URL -u "$NEXUS_USER" --password-stdin
                            docker push $NEXUS_URL/$DOCKER_IMAGE:$DOCKER_TAG
                        '''
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