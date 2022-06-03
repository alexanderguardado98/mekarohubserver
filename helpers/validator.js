import { capitalizeFirstLetter } from "./letter.js";

export const getErrorFields = (validationError) => {
    const {errors} = validationError;

    const fields = {}

    for (const key in errors) {
        const error = errors[key]
        fields[key] = capitalizeFirstLetter(error.message.replace("Path `", "").replace("`", "").replace(".", ""))
    }

    return fields
}