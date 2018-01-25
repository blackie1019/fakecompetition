# Megatron odds data generator #

This is a odds data generator POC for next version of UI for presentation application.

## Development and Host ##

### Setup ###

1. Clone repo

        git clone http://gitlab.ict888.net/michael.ni/fakecompetition.git

2. Install dependency for environment

        npm install

Done!

### Host ###

1. host for development 

        npm start 

2. Browser data from [http://localhost:3000/](http://localhost:3000/)

### API Path ###

1.Random Fake Data

By pass QueryString to generate random data

        http://localhost:3000/?compet={0}&marketline={1}

2.Local Stored File Data

Using local static file rander data directly (Source from current STAR odds data)

        http://localhost:3000/local

3.Realtime STAR site's data

Directly parse STAR site's data to Megatron's format (Source from sb.188bet.com)

        http://localhost:3000/getreal

4.Realtime uat STAR site's data for testing 200 selections

Directly parse STAR site's data to Megatron's format (Source from cashbk.ngstar.sb.com)

        http://localhost:3000/getuat

## DevDependency ##

### Essential Development Part ###
- [V] express
- [V] request
- [V] extend