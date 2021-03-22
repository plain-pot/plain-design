import {designPage} from "plain-design-composition";
import React from 'react';
import {DemoRow} from "../../components/DemoRow";
import PlCarousel from "../../../src/packages/PlCarousel";
import PlCarouselItem from "../../../src/packages/PlCarouselItem";

export default designPage(() => {

    const publicItemStyles = {
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px'
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlCarousel>
                    <PlCarouselItem style={{backgroundColor: '#8A2BE2', ...publicItemStyles}}>panel1</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#409EFF', ...publicItemStyles}}>panel2</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#F38585', ...publicItemStyles}}>panel3</PlCarouselItem>
                    <PlCarouselItem style={{backgroundColor: '#455a64', ...publicItemStyles}}>panel4</PlCarouselItem>
                </PlCarousel>
            </DemoRow>
        </div>
    )
})