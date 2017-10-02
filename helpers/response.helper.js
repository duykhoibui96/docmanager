module.exports = {

    sendResponse: function (res, data, err) {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }

    },

    sendTableList: function (req, res, docs, err) {

        if (err)
            res.status(500).send(err);
        else {

            var startIndex = Number(req.query.jtStartIndex);
            var pageSize = Number(req.query.jtPageSize);

            if (req.query.startDate && docs.length > 0 && docs[0].Time) {
                var start = new Date(Number(req.query.startDate));
                var end = new Date(Number(req.query.endDate));

                docs = docs.filter(function (item) {

                    var current = new Date(item.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    return start <= current && current <= end;

                })
            }

            if (req.query.searchText && docs.length > 0) {
                var text = req.query.searchText;
                var cat = req.query.cat;

                docs = docs.filter(function (item) {

                    if (!item[cat])
                        return false;
                    if (typeof(item[cat]) === 'number')
                        return item[cat] === Number(text);
                    return item[cat].includes(text);

                })
            }

            if (req.query.recent && docs.length > 10) {

                var index = docs.length - 10;
                docs = docs.slice(index);
                
            }

            res.status(200).send({

                Result: 'OK',
                TotalRecordCount: docs.length,
                Records: docs.slice(startIndex, startIndex + pageSize)

            })

        }



    },

    sendTableDetails: function (res, doc, err) {

        if (err)
            res.status(500).send(err);
        else {

            if (doc == null)
                res.status(200).send({

                    Result: 'ERROR',
                    Message: 'Không tìm thấy dữ liệu hiện tại'

                })
            else
                res.status(200).send({

                    Result: 'OK',
                    Record: doc

                })

        }


    },

    sendTableOptions: function (res, docs, err) {

        if (err)
            res.status(500).send(err);
        else {

            var options = [];

            docs.forEach(function (item) {

                var keyArray = Object.keys(item.toObject());
                var displayText = '';
                keyArray.map(function (key, index) {

                    if (index > 0)
                        displayText += item[key] + ' - ';

                })

                displayText = displayText.slice(0, -3);

                options.push({

                    Value: item[keyArray[1]],
                    DisplayText: displayText


                })

            })

            docs.filter(function(item) {

                return true;

            })

            res.status(200).send({

                Result: 'OK',
                Options: options

            })

        }


    }


}