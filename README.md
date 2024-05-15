docker build --build-arg BUILD_APP_ENV=workspace -t pvtclub-portal:devel -f Dockerfile.devel .
docker run -d -u `id -u` --network workspace --name pvtclub-portal.workspace -v $(pwd):/usr/src/app:delegated pvtclub-portal:devel
