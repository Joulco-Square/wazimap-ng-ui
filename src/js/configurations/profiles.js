import {Config as SAConfig} from './geography_sa';
import {getAPIUrl} from '../utils';

let config = new SAConfig();

const defaultHostname = 'wazimap-ng.africa';
const mainUrl = getAPIUrl('https://staging.wazimap-ng.openup.org.za');
const productionUrl = getAPIUrl('https://production.wazimap-ng.openup.org.za');

const profiles = {
	'wazi.webflow.io': {
			baseUrl: mainUrl,
			config: config
	},
	'localhost': {
			baseUrl: mainUrl,
			config: config
	},
	'localhost-dev': {
			baseUrl: 'http://localhost:8000',
			config: config
	},
	'geo.vulekamali.gov.za': {
			baseUrl: productionUrl,
			config: config
	},
	'beta.youthexplorer.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'capetownagainstcovid19.openup.org.za': {
			baseUrl: mainUrl,
			config: config
	},
	'covid-wazi.openup.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'wazimap-ng.africa': {
			baseUrl: mainUrl,
			config: config
	},
	'covid-ibp.openup.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'sifar-wazi.openup.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'mapyourcity.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'giz-projects.openup.org.za': {
			baseUrl: productionUrl,
			config: config
	},
	'covid-ccij.openup.org.za': {
			baseUrl: mainUrl,
			config: config
	},
	'cfafrica.wazimap-ng.africa': {
			baseUrl: 'https://api.cfafrica.wazimap-ng.africa',
			config: config
	},
	'ccij-water.openup.org.za': {
			baseUrl: productionUrl,
			config: config
	}
}

export function getProfile(hostname) {
	let this_profile
	if (hostname in profiles) {
		this_profile = profiles[hostname]
		this_profile.hostname = hostname
	}	else 	{
		this_profile = profiles[defaultHostname]
		this_profile.hostname = defaultHostname
	}
	return this_profile
}