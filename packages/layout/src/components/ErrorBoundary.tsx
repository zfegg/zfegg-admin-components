import React, {Component} from 'react';
import {Alert} from 'antd';

class ErrorBoundary extends Component {
    state: { error: Error | null } = {
        error: null,
    };

    componentDidCatch(error: Error): void {
        if (error) {
            this.setState({error});
        }
    }

    render() {
        const {error} = this.state;
        if (error) {
            const msg = error.stack;
            return <Alert message={error.message} description={msg} type={'error'} showIcon />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
