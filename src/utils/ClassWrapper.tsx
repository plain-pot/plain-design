import React from "react";

export class ClassWrapper extends React.Component<any, any> {

    constructor(props: any) {super(props)}

    render() {return this.props.children;}

}