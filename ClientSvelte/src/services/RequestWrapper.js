import {errorMSG} from "../stores"

export const ErrorWrapper = (response, clearMSG_Timeout = 2000) => {
    if (!response.succeeded) {
        if (response.data && (
            (Array.isArray(response.data) && response.data?.length > 0) || (!Array.isArray(response.data))
        )) {
            let errors = [];
            let keys = Object.keys(response.data);
            for (let i = 0; i < keys.length; i++) {
                if (Array.isArray(response.data[keys[i]])) {
                    for (let j = 0; j < response.data[keys[i]].length; j++)
                        errors.push(response.data[keys[i]][j]);
                } else {
                    errors.push(response.data[keys[i]]);
                }
            }
            errorMSG.set(errors);
        } else if (response.messages?.length > 0) {
            errorMSG.set(response.messages);
        } else if (response.exception) {
            errorMSG.set([response.exception]);
        }
        setTimeout(() => errorMSG.set([]), clearMSG_Timeout);
    } else {
        return response;
    }
}
