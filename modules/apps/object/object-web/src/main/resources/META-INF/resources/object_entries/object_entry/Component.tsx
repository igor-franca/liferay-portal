import {DatePicker} from "@liferay/object-js-components-web"
import React from "react"

export default function Component() {
    return (
        <>
            <DatePicker
                onChange={() => {}}
                type={'date_time'}
            />
    
            <input id="id" value={"UTCValue"} type="hidden"/>
        </>
    )
}