import type React from "react";
import type { TreeData } from ".";

export const getRandomString = () => Math.random().toString(36).substr(2);

/**
 * 添加符合要求的key,title,children，注意这里会添加一些属性。
 * @param data
 * @param fieldNames
 */
export const transferOriginData = (data: TreeData[], fieldNames: any) => {
  const { key, title, children } = fieldNames;
  let node;
  const len = data.length;
  for (let i = 0; i < len; i++) {
    node = data[i];
    node.key = node[key];
    node.title = node[title];
    node.children = node[children];
    if (Array.isArray(node.children)) {
      transferOriginData(node.children, fieldNames);
    }
  }
};

/**
 * 删除树中的一个节点，并且返回该节点
 * @param data
 * @param key
 * @returns
 */
export const removeNode = (
  data: TreeData[],
  key: React.Key
): TreeData | null => {
  const len = data.length;
  let node;
  for (let i = 0; i < len; i++) {
    node = data[i];
    if (node.key === key) {
      data.splice(i, 1);
      return node;
    }
    if (Array.isArray(node.children)) {
      const removedNode = removeNode(node.children, key);
      if (removedNode) {
        return removedNode;
      }
    }
  }
  return null;
};

/**
 * 添加同级节点，添加可编辑的输入框，不是真的新增数据
 * @param data
 * @param key
 * @returns
 */
export const addSameLevelNode = (data: TreeData[], key: React.Key) => {
  const idx = data.findIndex(item => item.key === key);
  if (idx !== -1) {
    // 新增一个编辑中的节点
    data.splice(idx + 1, 0, {
      key: getRandomString(),
      isEditing: true,
    });
    return;
  }
  data.forEach((node: any) => {
    if (Array.isArray(node.children)) {
      addSameLevelNode(node.children, key);
    }
  });
};

/**
 * 添加子节点
 * @param data
 * @param key
 */
export const addSubNode = (data: TreeData[], key: React.Key) => {
  const idx = data.findIndex(item => item.key === key);
  if (idx !== -1) {
    const node = data[idx];
    if (Array.isArray(node.children)) {
      node.children.unshift({
        key: getRandomString(),
        isEditing: true,
      });
    } else {
      node.children = [
        {
          key: getRandomString(),
          isEditing: true,
        },
      ];
    }
    return;
  } else {
    data.forEach((node: any) => {
      if (Array.isArray(node.children)) {
        addSubNode(node.children, key);
      }
    });
  }
};

/**
 * 确认添加节点，并返回该节点
 * @param data
 * @param key
 */
export const confirmAddNode = (
  data: TreeData[],
  key: React.Key,
  val: string
): TreeData | null => {
  const len = data.length;
  let node;
  for (let i = 0; i < len; i++) {
    node = data[i];
    if (node.key === key) {
      node.isEditing = false;
      node.title = val;
      return node;
    }
    if (Array.isArray(node.children)) {
      const addedNode = confirmAddNode(node.children, key, val);
      if (addedNode) {
        return addedNode;
      }
    }
  }
  return null;
};

/**
 * 取消添加节点
 * @param data
 * @param key
 */
export const cancelNode = (data: TreeData[], key: React.Key) => {
  const idx = data.findIndex(item => item.key === key);
  if (idx !== -1) {
    data.splice(idx, 1);
    return;
  }
  data.forEach((node: any) => {
    if (Array.isArray(node.children)) {
      cancelNode(node.children, key);
    }
  });
};

/**
 * 编辑节点
 * @param data
 * @param key
 * @returns
 */
export const editNode = (data: TreeData[], key: React.Key) => {
  const idx = data.findIndex(item => item.key === key);
  if (idx !== -1) {
    const node = data[idx];
    node.isEditing = true;
    return node;
  }
  data.forEach((node: any) => {
    if (Array.isArray(node.children)) {
      return editNode(node.children, key);
    }
    return [];
  });
  return [];
};
