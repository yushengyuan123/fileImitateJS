interface response {
    code: number,
    message: string,
    data: any
}

export class ResultBean {
    public successBean (message: string, data ?: any): response {
        return {
            code: 1,
            message: message,
            data: data ? data : null
        }
    }

    public failBean(message: string, data ?: any): response {
        return {
            code: -1,
            message: message,
            data: data ? data : null
        }
    }
}
