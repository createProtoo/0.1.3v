function JSONToExcelConvertor(JSONData, FileName, title, filter) {
    if (!JSONData)
        return;
    //转化json为object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = "<table>";

    //设置表头  
    var row = "<tr>";

    if (title) {
        //使用标题项
        for (var i in title) {
            row += "<th align='center'>" + title[i] + '</th>';
        }

    }
    else {
        //不使用标题项
        for (var i in arrData[0]) {
            row += "<th align='center'>" + i + '</th>';
        }
    }

    excel += row + "</tr>";

    //设置数据  
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";

        for (var index in arrData[i]) {
            //判断是否有过滤行
            if (filter) {
                if (filter.indexOf(index) == -1) {
                    var value = arrData[i][index] == null ? "" : arrData[i][index];
                    row += '<td>' + value + '</td>';
                }
            }
            else {
                var value = arrData[i][index] == null ? "" : arrData[i][index];
                row += "<td align='center'>" + value + "</td>";
            }
        }

        excel += row + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";


    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}  


function exportJson2Excel(json, type) {
    //TODO 记录导出操作日志
    var log = { "type": "json2excel" };
    //title
    try {
        var title = new Set();
        for (var i = 0; i < json.length; i++) {
            var r = json[i];
            getProFromObject(r, title);
        }
        console.log("title", title);

        var data = [];
        for (var i = 0; i < json.length; i++) {
            var r = json[i];
            var dataRow = [];
            title.forEach(function (t) {
                var d1 = r[t];
                var ss = t.split(".");
                if (ss.length >= 2) {
                    var tmp = r;
                    for (var i = 0; i < ss.length; i++) {
                        var s = ss[i];
                        tmp = tmp[s];
                        if (!tmp) {
                            break;
                        }
                    }
                    d1 = tmp;
                }
                if (d1) {
                    if (typeof d1 == 'object') {
                        dataRow.push(JSON.stringify(d1));
                    } else {
                        dataRow.push(d1);
                    }

                } else {
                    dataRow.push("");
                }

            });

            data.push(dataRow);
        }
        console.log("data", data);
        JSONToExcelConvertor(data, 'Report', Array.from(title), type);
    } catch (err) {
        console.error(err);
        alert("导出报错：" + err.stack);
        log.error = err.stack;
        log.json = json;
    } finally {
      /*  OplogsService.save(log).$promise.then(function (res) {
            console.log(res);
        }).catch(function (error) {
            console.log(error);
            alert("系统错误:" + JSON.stringify(error));
        });*/
    }

}
function getProFromObject(r, title, parentsPros) {
    for (var rp in r) {
        if (parentsPros) {
            title.add(parentsPros + "." + rp);
        } else {
            title.add(rp);
        }
        if (typeof r[rp] == 'object') {
            if (parentsPros) {
                getProFromObject(r[rp], title, parentsPros + "." + rp);
            } else {
                getProFromObject(r[rp], title, rp);
            }

        }
    }
}
