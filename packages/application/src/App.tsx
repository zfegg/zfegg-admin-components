import React, {FC, Suspense} from "react";
import {DependencyContainerInterface} from "@moln/dependency-container";
import {DependencyContainerProvider} from "@moln/react-ioc";
import {unstable_HistoryRouter as Router} from "react-router-dom";
import {PageLoading} from "@ant-design/pro-layout";
import type {History} from "history";
import "./App.css";
import Routes from "./components/Routes";

type Props = {container: DependencyContainerInterface, history: History}

const App: FC<Props> = ({container, history}) => (
    <DependencyContainerProvider container={container}>
        <Router history={history}>
            <Suspense fallback={<PageLoading tip={"加载中..."} />}>
                <Routes />
            </Suspense>
        </Router>
    </DependencyContainerProvider>
)

export default App
