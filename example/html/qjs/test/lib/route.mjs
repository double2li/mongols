var route = function () {
    this.instance = null;
    this.map = {};
    this.add = function (method, pattern, callback) {
        if (typeof (this.map[pattern]) == "undefined") {
            var ele = {};
            ele.method = method;
            ele.pattern = pattern;
            ele.callback = callback;
            this.map[pattern] = ele;
        }
    }

    this.get = function (pattern, callback) {
        this.add(['GET'], pattern, callback);
    };

    this.post = function (pattern, callback) {
        this.add(['POST'], pattern, callback);
    };

    this.put = function (pattern, callback) {
        this.add(['PUT'], pattern, callback);
    };

    this.head = function (pattern, callback) {
        this.add(['HEAD'], pattern, callback);
    };

    this.run = async function (m) {
        var pattern = null,reg = null,param = null,ele = null;
        for (pattern in this.map) {
            reg = new RegExp(pattern, 'ig');
            param = await reg.exec(m.uri());
            if (param != null) {
                ele = this.map[pattern];
                if (ele.method.indexOf(m.method()) >= 0) {
                    await ele.callback(m, param);
                    break;
                }
            }
        }
    }
}

route.get_instance = function () {
    if (this.instance == null) {
        this.instance = new route();
    }
    return this.instance;
}

export default route;