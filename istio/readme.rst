Istio Getting Started
===============================================================================

Here are the steps that managed me to setup Istio on a 4 nodes cluster within Europe.

Other interesting links are:

* https://codelabs.developers.google.com/codelabs/cloud-hello-istio/index.html?index=..%2F..%2Findex#7
* https://github.com/ZackButcher/install-to-ops

Quick Start
-------------------------------------------------------------------------------

## Install Istio on GKE cluster

#. Setup your environment
    I'm running these commands from my local machine. Make sure that you have the latest version
    from the gcloud commandline tools installed. (It requires kubectl 1.7.8).
    Optionally:
    
        gcloud config set compute/zone europe-west1-d

#. You will need to create a new GKE cluster, with atleast 4 nodes. In Alpha. With admin rights. 

    .. code-block:: bash

        gcloud alpha container clusters create "myistio" --zone "europe-west1-d" --username="admin" --machine-type "n1-standard-2" --num-nodes "4" --no-enable-legacy-authorization --enable-kubernetes-alpha 
        gcloud container clusters get-credentials myistio --zone europe-west1-d --project leeboonstra-blogdemos
        kubectl create clusterrolebinding cluster-admin-binding \
            --clusterrole=cluster-admin \
            --user=$(gcloud config get-value core/account)

#. Download Istio

    .. code-block:: bash

        curl -L https://git.io/getLatestIstio | sh -

#. Install Istio

     .. code-block:: bash

        cd istio-0.2.12 (this is the version that I tried)
        export PATH=$PWD/bin:$PATH
        kubectl apply -f install/kubernetes/istio-auth.yaml
        kubectl apply -f install/kubernetes/istio-initializer.yaml

#. Deploy Bookshell Application

     .. code-block:: bash

        kubectl apply -f samples/bookinfo/kube/bookinfo.yaml


#. Test Bookshell Application

    .. code-block:: bash

        kubectl get ingress -o wide
        export GATEWAY_URL=<GATEWAY ADDRESS>

        curl -o /dev/null -s -w "%{http_code}\n" http://${GATEWAY_URL}/productpage

    Navigate in the browser to http://<gateway_url>/productpage


#. Play around with routing

    The BookInfo sample deploys three versions of the reviews microservice.
    When you accessed the application several times, you will have noticed that the output sometimes contains star ratings 
    and sometimes it does not. This is because without an explicit default version set, Istio will route requests to all available 
    versions of a service in a random fashion.

    We use the istioctl command line tool to control routing, adding a route rule that says all traffic should go to the v1 service. 
    First, confirm there are no route rules installed:

    Confirm that there are no routes installed:

    .. code-block:: bash

        istioctl get routerules -o yaml
        istioctl create -f samples/bookinfo/kube/route-rule-all-v1.yaml -n default

#. Enable Metrics and Tracing

    ## Zipkin

    .. code-block:: bash

        kubectl apply -f install/kubernetes/addons/zipkin.yaml
        kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=zipkin -o jsonpath='{.items[0].metadata.name}') 9411:9411 &

    First visit the book review application again, and then in your browser navigate to: http://localhost:9411/ 
    Select a trace from the trace list, hit enter. - Click one of the traces to get service details.

    ## Istio Dashboard Grafana (requires Prometheus)

     .. code-block:: bash

        kubectl apply -f install/kubernetes/addons/prometheus.yaml
        kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=prometheus -o jsonpath='{.items[0].metadata.name}') 9090:9090 &   
        kubectl apply -f install/kubernetes/addons/grafana.yaml
        kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000 &

    First visit the book review application again, and then in your browser navigate to http://localhost:3000/dashboard/db/istio-dashboard

#. Uninstall steps

    .. code-block:: bash

        killall kubectl
        kubectl delete -f samples/bookinfo/kube/bookinfo.yaml
        kubectl delete -f install/kubernetes/istio-initializer.yaml
        kubectl delete -f install/kubernetes/istio-auth.yaml
        gcloud container clusters delete myistio
