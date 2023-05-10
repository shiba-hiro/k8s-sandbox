# Argo CD

Argo CD を手元の minikube cluster へ導入し、 manifest file によって連携されることを試すことができる。


## Prerequisites

### kubectl

https://kubernetes.io/ja/docs/tasks/tools/install-kubectl/

### minikube

https://minikube.sigs.k8s.io/docs/start/

### Argo CD CLI

https://argo-cd.readthedocs.io/en/stable/getting_started/#2-download-argo-cd-cli

### docker

https://docs.docker.com/engine/install/

## Quick start


### cluster の起動

```sh
minikube start

# Show dashboard if necessary
# minikube dashboard

kubectl create namespace app-main
```

### deploy 対象の container image の用意

```sh
cd applications/nodejs-server
docker build -t nodejs-server:first .

# test the container works
# docker run -it --rm --name nodejs-server -p 3770:3770 nodejs-server:first
# => http://localhost:3770/healthcheck

# instead of `push` image to the registry
minikube image load nodejs-server:first

minikube image ls
# `docker.io/library/nodejs-server:first` appears
```


### Argo CD へ監視させる manifest repository の用意


```sh
docker compose up -d

# Wait for the application to start
docker logs -f argocd-web-1

# Check the password for `root` account and copy it
docker exec -it argocd-web-1 cat /etc/gitlab/initial_root_password
```

Access to http://localhost:3780.

Login as root.

Create a blank project as `Public` with naming `k8s-manifest` from http://localhost:3780/projects/new#blank_project.
Make sure that the project URL is `http://localhost:3780/root/k8s-manifest`.


```sh
cd k8s-manifest

git init --initial-branch=main
# The URL depends on the project in GitLab
git remote add origin http://localhost:3780/root/k8s-manifest.git
git add .
git commit -m "Initial commit"

# input `root` and same password as GitLab UI
git push -u origin main
```

Check http://localhost:3780/root/k8s-manifest hosts manifest files and can be accessed from an incognito browser.

### cluster への Argo CD 導入

Just follow official document.  
https://argo-cd.readthedocs.io/en/stable/getting_started/
```sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

kubectl port-forward svc/argocd-server -n argocd 3760:443
# => access to http://localhost:3760

argocd admin initial-password -n argocd
# => copy password and login to argocd UI with `admin / <copied password>`
```


### Argo CD の Application resource 作成を通じた service, deployment 生成

```sh
cd k8s-manifest/argocd/

kubectl apply -n argocd -f nodejs-server.yml

kubectl get pods -n app-main
# => you can see `nodejs-server` is running!
```


### 各種リソースの削除

```sh
docker compose down

minikube delete

docker rmi nodejs-server:first
```
