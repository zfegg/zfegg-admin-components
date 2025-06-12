import React, {FC} from 'react';
import {Result} from 'antd';
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {Forbidden, NotFound} from "../pages";

const ErrorBoundary: FC = () => {
    const error = useRouteError();
    console.error(error)
    if (isRouteErrorResponse(error)) {

        switch (error.status) {
        case 403:
            return <Forbidden />
        case 404:
            return <NotFound title={'404 ' + error.statusText} />
        default:
            return (
                <Result
                    status="error"
                    title={error.statusText}
                    extra={error.data + ""}
                />
            )  
        }
    } else if (error instanceof Error) {
        return (
            <Result
                status="error"
                title={error.message}
                extra={<pre style={{textAlign: "left", display: "inline-block"}}>{error.stack}</pre>}
            />
        );
    }

    let message = ""
    try {
        message = error + ""
    } catch (e) {
    }
    return (
        <Result
            status="error"
            title="Something went wrong."
            extra={message}
        />
    );
}

export default ErrorBoundary;
