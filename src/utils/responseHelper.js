const response = {
    success: (res, status, message, data = null, pagination = null) => {
        const responseObj = {
            status: status,
            message: message
        };

        if (data !== null) {
            responseObj.data = data;
        }

        if (pagination !== null) {
            responseObj.pagination = pagination;
        }

        return res.status(status).json(responseObj);
    },

    error: (res, status, message) => {
        return res.status(status).json({
            status: status,
            message: message
        });
    }
};

module.exports = response;