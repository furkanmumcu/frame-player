echo $1
npm install
export PATH=./node_modules/.bin:$PATH
http-server -a localhost -p $1 -c-1
