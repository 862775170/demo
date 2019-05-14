
export function listSearch(arr, search, option) {
    let result = []

    if (search) {
        arr.forEach(element => {

            for (const key in option) {
                const value = element[option[key]];
                let l = new String(value).indexOf(search) != -1
                if (l) {
                    result.push(element)
                    break;
                }
            }
        });
    } else {
        result = arr
    }

    return result
}