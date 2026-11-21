import React from 'react';

const UnauthorizePage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-base-content">Unauthorized Access</h1>
            <p className="max-w-md text-base-content/60">
                You do not have permission to access this page. Please contact the administrator if you believe this is an error.
            </p>
        </div>
    );
};

export default UnauthorizePage;