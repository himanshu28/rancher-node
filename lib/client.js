'use strict';

const Joi = require('joi');
const Wreck = require('wreck');

const internals = {};
internals.schema = Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    access_key: Joi.string().required(),
    secret_key: Joi.string().required()
});

class RancherClient {
    constructor(config) {

        Joi.assert(config, internals.schema);
        this._wreck = Wreck.defaults({
            baseUrl: `http://${config.host}:${config.port}`,
            headers: {
                Authorization: 'Basic ' + new Buffer(config.access_key + ':' + config.secret_key).toString('base64')
            }
        });

        this._request = (method, url, options) => {

            return new Promise((resolve, reject) => {

                this._wreck.request(method, url, options, (err, res) => {

                    if (err) {
                        return reject(err);
                    }

                    if (res.statusCode < 200 ||
                        res.statusCode >= 300) {

                        const e = new Error('Invalid response code: ' + res.statusCode);
                        e.statusCode = res.statusCode;
                        e.headers = res.headers;
                        return reject(e);
                    }

                    this._wreck.read(res, { json: true }, (err, payload) => {

                        if (err) {
                            return reject(err);
                        }

                        return resolve(payload);
                    });
                });
            });
        };
    };

    createContainer(container) {
        return this._request('post', '/v2-beta/projects/1a5/container', { payload: JSON.stringify(container) });
    };

    getContainer(containerId) {

        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('get', `/v2-beta/projects/1a5/container/${containerId}`);
    }

    updateContainer(container) {
        return this._request('post', `/v2-beta/projects/1a5/container/${container.id}`, { payload: JSON.stringify(container) });
    }

    stopContainer(containerId, stopParams) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('post', `/v2-beta/projects/1a5/container/${containerId}/?action=stop`, { payload: JSON.stringify(stopParams) });
    }

    startContainer(containerId) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('post', `/v2-beta/projects/1a5/container/${containerId}/?action=start`);
    }

    restartContainer(containerId) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('post', `/v2-beta/projects/1a5/container/${containerId}/?action=restart`);
    }

    removeContainer(containerId) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('delete', `/v2-beta/projects/1a5/container/${containerId}`);
    }

    purgeContainer(containerId) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('post', `/v2-beta/projects/1a5/container/${containerId}/?action=purge`);
    }

    getContainerLogs(containerId) {
        Joi.assert(containerId, Joi.string().required(), 'Must specify container id');
        return this._request('post', `/v2-beta/projects/1a5/container/${containerId}/?action=logs`);
    }

    createStack(stack) {
        return this._request('post', '/v2-beta/projects/1a5/stack', { payload: JSON.stringify(stack) });
    }

    getStack(stackId) {

        Joi.assert(stackId, Joi.string().required(), 'Must specify stack id');
        return this._request('get', `/v2-beta/projects/1a5/stack/${stackId}`);
    }

    getStackServices(stackId) {

        Joi.assert(stackId, Joi.string().required(), 'Must specify stack id');
        return this._request('get', `/v2-beta/projects/1a5/stack/${stackId}/services`);
    }

    removeStack(stackId) {

        Joi.assert(stackId, Joi.string().required(), 'Must specify stack id');
        return this._request('post', `/v2-beta/projects/1a5/stack/${stackId}/?action=remove`);
    }

    getPorts() {
        return this._request('get', `/v2-beta/projects/1a5/ports`);
    }

    getHosts() {
        return this._request('get', `/v2-beta/projects/1a5/hosts`);
    }

    getHost(hostId) {
        return this._request('get', `/v2-beta/projects/1a5/hosts/${hostId}`);
    }
};

module.exports = RancherClient;
