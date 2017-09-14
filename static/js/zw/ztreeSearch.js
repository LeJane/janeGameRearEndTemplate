/**
 * 展开树
 * @param treeId
 */
function expand_ztree(treeId) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.expandAll(true);
}

/**
 * 收起树：只展开根节点下的一级节点
 * @param treeId
 */
function close_ztree(treeId) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.transformToArray(treeObj.getNodes());
    var nodeLength = nodes.length;
    for (var i = 0; i < nodeLength; i++) {
        if (nodes[i].id == '0') {
            //根节点：展开
            treeObj.expandNode(nodes[i], true, true, false);
        } else {
            //非根节点：收起
            treeObj.expandNode(nodes[i], false, true, false);
        }
    }
}

/**
 * 搜索树，高亮显示并展示【模糊匹配搜索条件的节点s】
 * @param treeId
 * @param searchConditionId 文本框的id
 */
function search_ztree(treeId, searchConditionId,type) {
    searchByFlag_ztree(treeId, searchConditionId, "",type);
}

/**
 * 搜索树，高亮显示并展示【模糊匹配搜索条件的节点s】
 * @param treeId
 * @param searchConditionId     搜索条件Id
 * @param flag                  需要高亮显示的节点标识
 */
function searchByFlag_ztree(treeId, searchConditionId, flag,type) {
    //<1>.搜索条件
    var searchCondition = $('#' + searchConditionId).val();
    var highlightNodes = [];
    var allNodes = [];
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    highlightNodes = treeObj.getNodesByParamFuzzy("name", searchCondition, null); // 满足搜索条件的节点
    allNodes = treeObj.getNodesByParamFuzzy("type",type, null); // 所有type型nodes
    if (searchCondition != "") {
        if (type == "group") {  // 企业
            // 需要显示是节点（包含父节点）
            var showNodes = [];
            if (highlightNodes != null) {
                for (var i = 0; i < highlightNodes.length; i++) {
                    //组装显示节点的父节点的父节点....直到根节点，并展示
                    getParentShowNodes_ztree(treeId, highlightNodes[i],showNodes);
                }
                treeObj.hideNodes(allNodes)
                treeObj.showNodes(showNodes);
                treeObj.expandAll(true);
            }
        }else{
        	//<2>.得到模糊匹配搜索条件的节点数组集合
            treeObj.hideNodes(allNodes)
            treeObj.showNodes(highlightNodes);
            treeObj.expandAll(true);
        }
    }else{
    	treeObj.showNodes(allNodes)
        treeObj.expandAll(true);
    }
    //<3>.高亮显示并展示【指定节点s】
    // highlightAndExpand_ztree(treeId, highlightNodes, flag);
}

/**
 * 高亮显示并展示【指定节点s】
 * @param treeId
 * @param highlightNodes 需要高亮显示的节点数组
 * @param flag           需要高亮显示的节点标识
 */
function highlightAndExpand_ztree(treeId, highlightNodes, flag) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    //<1>. 先把全部节点更新为普通样式
    var treeNodes = treeObj.transformToArray(treeObj.getNodes());
    for (var i = 0; i < treeNodes.length; i++) {
        treeNodes[i].highlight = false;
        treeObj.updateNode(treeNodes[i]);
    }
    //<2>.收起树, 只展开根节点下的一级节点
    // close_ztree(treeId);
    //<3>.把指定节点的样式更新为高亮显示，并展开
    if (highlightNodes != null) {
        for (var i = 0; i < highlightNodes.length; i++) {
            if (flag != null && flag != "") {
                if (highlightNodes[i].flag == flag) {
                    //高亮显示节点，并展开
                    highlightNodes[i].highlight = true;
                    treeObj.updateNode(highlightNodes[i]);
                    //高亮显示节点的父节点的父节点....直到根节点，并展示
                    var parentNode = highlightNodes[i].getParentNode();
                    var parentNodes = getParentNodes_ztree(treeId, parentNode);
                    treeObj.expandNode(parentNodes, true, false, true);
                    treeObj.expandNode(parentNode, true, false, true);
                }
            } else {
                //高亮显示节点，并展开
                highlightNodes[i].highlight = true;
                treeObj.updateNode(highlightNodes[i]);
                //高亮显示节点的父节点的父节点....直到根节点，并展示
                // setFontCss_ztree(treeId,highlightNodes[i]);
                var parentNode = highlightNodes[i].getParentNode();
                var parentNodes = getParentNodes_ztree(treeId, parentNode);
                treeObj.expandNode(parentNodes, true, false, true);
                treeObj.expandNode(parentNode, true, false, true);
            }
        }
    }
}

/**
 * 递归得到指定节点的父节点的父节点....直到根节点
 */
function getParentNodes_ztree(treeId, node) {
    if (node != null) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var parentNode = node.getParentNode();
        return getParentNodes_ztree(treeId, parentNode);
    } else {
        return node;
    }
}

/**
 * 递归得到指定节点的父节点的父节点....直到根节点（用于企业搜索）
 */
function getParentShowNodes_ztree(treeId, node, showNodes) {
    if (node != null) {
    	showNodes.push(node);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var parentNode = node.getParentNode();
        return getParentShowNodes_ztree(treeId, parentNode,showNodes);
    } else {
        return node;
    }
}

/**
 * 设置树节点字体样式
 */
function setFontCss_ztree(treeId, treeNode) {
    if (treeNode.id == 0) {
        //根节点
        return {color: "#333", "font-weight": "bold"};
    } else {
        if (treeNode.vehicleType == "out") { // 车辆树结构有父级组织的车
            if (!!treeNode.highlight) {
                return {color: "#6dcff6", "font-weight": "bold"};
            } else {
                return {color: "red"};
            }
        } else {
            return (!!treeNode.highlight) ? {color: "#6dcff6", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
        }

    }
}