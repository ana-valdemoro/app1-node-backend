#!/usr/bin/env sh
# $0 is a script name, 
# $1, $2, $3 etc are passed arguments  # $1 is our command 
CMD=$1
  
case "$CMD" in  
  "dev" ) 
  export NODE_ENV=development 
  yarn install --frozen-lockfile --dev
  yarn cache clean
  rm -rf /tmp
  exec yarn dev
  ;;
		
	"start" ) 
	# we can modify files here, using ENV variables passed in 
	# "docker create" command. It can't be done during build process.  
	export NODE_ENV=production
  yarn install --frozen-lockfile --production
  yarn cache clean
  rm -rf /tmp
  exec yarn start
	;;

	* ) 
  # Run custom command. Thanks to this line we can still use 
  # "docker run our_image /bin/bash" and it will work  
  exec $CMD ${@:2} 
  ;; 
esac