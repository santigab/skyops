pipeline {
    agent any
    environment {
        IMAGE = "skyops/flight-api"
        VERSION = "1.0.${BUILD_NUMBER}"
    }
    stages {
        stage('Build & Test') {
            steps {
                dir('flight-api') { sh 'mvn -B clean verify' }
            }
        }
        stage('Quality Gate — SonarQube') {
            steps {
                dir('flight-api') {
                    sh 'mvn sonar:sonar -Dsonar.host.url=http://sonarqube:9000 -Dsonar.token=$SONAR_TOKEN'
                }
            }
        }
        stage('Publish artifact — Nexus') {
            steps {
                dir('flight-api') { sh 'mvn deploy -DskipTests -DaltDeploymentRepository=nexus::http://nexus:8081/repository/maven-releases/' }
            }
        }
        stage('Docker build') {
            steps { sh "docker build -t ${IMAGE}:${VERSION} flight-api/" }
        }
        stage('Security scan — Trivy (gate bloqueante)') {
            steps {
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --exit-code 1 --severity CRITICAL ${IMAGE}:${VERSION}"
            }
        }
    }
    post {
        failure { echo '❌ Pipeline roto — el gate hizo su trabajo' }
        success { echo "✅ ${IMAGE}:${VERSION} listo para deploy" }
    }
}