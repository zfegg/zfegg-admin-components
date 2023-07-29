import React, {FC} from 'react';
import {Result} from 'antd';
import {useRouteError} from "react-router-dom";
import {ErrorResponse} from '@remix-run/router'
import {Forbidden, NotFound} from "../pages";

const ErrorBoundary: FC = () => {
    let error = useRouteError();
    if (error instanceof ErrorResponse) {

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
                    extra={error.error + ""}
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
