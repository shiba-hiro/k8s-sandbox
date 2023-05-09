
```
minikube start

# minikube dashboard
```

```
docker compose up -d

docker logs -f argocd-web-1

docker exec -it argocd-web-1 cat /etc/gitlab/initial_root_password
```

access to http://localhost:3780

login as root

update group visibility level as Public from http://localhost:3780/dashboard/groups

initialize project as public

update repository visibility level as Public from http://localhost:3780/gitlab-instance-50bd1543/app-manifest/edit


```
cd app-example
docker build -t app-example:first .

# test
# docker run -it --rm --name app-example -p 3770:3770 app-example:first
# => http://localhost:3770/healthcheck

# instead of `push`
minikube image load app-example:first

minikube image ls
```

```
cd app-manifest

git init --initial-branch=main
# depends on the project
git remote add origin http://localhost:3780/gitlab-instance-50bd1543/app-manifest.git
git add .
git commit -m "Initial commit"

# input `root` and password same as GitLab UI
git push -u origin main
```



Install argocd
https://argo-cd.readthedocs.io/en/stable/getting_started/
```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# https://argo-cd.readthedocs.io/en/stable/cli_installation/
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64


argocd admin initial-password -n argocd
# => copy password

kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

kubectl port-forward svc/argocd-server -n argocd 3760:443
# => access to localhost:3760 and login with `admin / <copied password>`
```


Create Application
```
cd argocd-manifest

# Fix `repoURL` as you created.
# Remember that specify ip address as your private one that minikube VM can access.
vim app-example.yml

kubectl apply -n argocd -f app-example.yml
```


```
minikube delete
```


TODO;
https://github.com/kubernetes/minikube/issues/8439#issuecomment-799801736