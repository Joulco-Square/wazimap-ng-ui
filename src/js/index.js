import 'babel-polyfill';

import configureApplication from './load';
import {Config as SAConfig} from './configurations/geography_sa';
import Analytics from './analytics';
import {API} from './api';
import * as Sentry from '@sentry/browser';
import {getHostname, getAPIUrl, loadDevTools} from './utils';
import {ErrorNotifier} from "./error-notifier";
import {getProfile} from './configurations/profiles'

let hostname = getHostname();

const ENVIRONMENT = `${process.env.ENVIRONMENT}`;
const GOOGLE_ANALYTICS_ID = `${process.env.GOOGLE_ANALYTICS_ID}`;
const SENTRY_DSN = `${process.env.SENTRY_DSN}`;

if (SENTRY_DSN !== "undefined" && SENTRY_DSN !== "") {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT
    });
} else {
    console.warn("Not initialising Sentry because SENTRY_DSN is not set");
}

async function init() {
    let pc = getProfile(hostname)

    const errorNotifier = new ErrorNotifier();
    errorNotifier.registerErrorHandler();

    const api = new API(pc.baseUrl, pc.config);
    const data = await api.getProfileConfiguration(pc.hostname);

    pc.config.setConfig(data.configuration || {})
    pc.config.setVersions(data.geography_hierarchy || {})
    api.restrictValues = pc.config.restrictValues;

    pc.config.api = api;
    pc.profile = data.id;
    pc.config.baseUrl = pc.baseUrl;
    if (GOOGLE_ANALYTICS_ID !== "undefined" && GOOGLE_ANALYTICS_ID !== "") {
        pc.config.analytics = initGA(GOOGLE_ANALYTICS_ID, pc.profile);
    } else {
        // dev or staging
        pc.config.analytics = initGA('UA-93649482-33', pc.profile);
    }
    pc.config.profile = data.id;

    configureApplication(data.id, pc.config);
}

function initGA(id, profile) {
    const head = document.getElementsByTagName('head')[0];

    const analyticsScript = document.createElement('script');
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    head.appendChild(analyticsScript);

    const configScript = document.createElement('script');
    configScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        const analyticsId = '${id}';
        gtag('js', new Date());
        gtag('config', analyticsId, { 'send_page_view': false });
        gtag('config', analyticsId, {
            'custom_map': {'dimension1': 'profile'}
        });
        window.gtag = gtag;
        `;
    head.appendChild(configScript);

    return new Analytics(`${id}`, profile);
}

window.init = init;
loadDevTools(() => {
    const serverEnabled = sessionStorage.getItem("wazi.localServer");
    if (serverEnabled) {
        import('./server').then(server => server.makeServer())
    }
    init();
})
