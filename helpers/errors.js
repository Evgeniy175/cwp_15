const express = require('express');

express.response.error = function(error) {
    if (!error.code) {
        error = {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }

    this.status(error.status).json(error);
};

module.exports = {
    invalidId: {
        message: 'Invalid id',
        code: 'invalid_id',
        status: 400
    },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials',
        status: 403
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 403
    },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    },
    invalidEntity: {
        message: 'Unprocessable entity',
        code: 'invalid_entity',
        status: 422
    },
    badDomain: {
        message: 'Bad domain',
        code: 'bad_domain_requested',
        status: 400
    },
    domainNotAvailable: {
        message: 'Domain not available',
        code: 'domain_not_available',
        status: 400
    },
    badUserDomain: {
        message: 'User doesn\'t have selected domain',
        code: 'bad_user_domain',
        status: 400
    }
};