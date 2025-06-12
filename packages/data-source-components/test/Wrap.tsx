import {FC, PropsWithChildren} from "react";
import {DependencyContainerProvider} from "@moln/react-ioc";
import container from "./container";

const Wrap: FC<PropsWithChildren> = ({children}) => {
    return (
        <DependencyContainerProvider container={container}>
            {children}
        </DependencyContainerProvider>
    )
}

export default Wrap