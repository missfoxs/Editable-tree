import type { Key } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import type { TreeProps } from 'antd';
import { message, Tree } from 'antd';
import {
  removeNode,
  addSameLevelNode,
  confirmAddNode,
  addSubNode,
  cancelNode,
  editNode,
  transferOriginData,
} from './util-tree';
import EditableTreeNode from './editable-tree-node';

export type TreeData = {
  key: Key;
  isEditing?: boolean;
  title?: string;
  children?: TreeData[];
};

const EditableTree: React.FC<
  TreeProps & {
    onRemove?: (node: TreeData | null) => void; // 删除后的回掉函数
    onEdit?: (node: TreeData | null) => void; // 编辑后的回掉函数
    editingTips?: string; // 编辑提示
    removeTips?: string; // 删除时提示
    canEdit?: boolean; // 是否可编辑
  }
> = ({
  canEdit = false,
  treeData: originData,
  editingTips = '当前有正在编辑的节点，请先保存',
  fieldNames = { key: 'key', title: 'title', children: 'children' },
  removeTips = '删除当前节点会连同子节点一起删除，是否确认？',
  onRemove = () => {},
  onEdit = () => {},
  ...rest
}) => {
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [isSomeNodeEditing, setIsSomeNodeEditing] = useState<boolean>(false);
  console.log('fieldNames', fieldNames);

  // 删除某个节点
  const handleRemove = useCallback(
    (key: React.Key) => {
      const _treeData = [...treeData];
      const removedNode = removeNode(_treeData, key);
      setTreeData(_treeData);
      onRemove?.(removedNode);
    },
    [onRemove, treeData],
  );

  // 添加同级目录
  const handleAddSameLevelNode = useCallback(
    (key: React.Key) => {
      if (isSomeNodeEditing) {
        message.warn(editingTips);
        return;
      }
      const _treeData = [...treeData];
      addSameLevelNode(_treeData, key);
      setIsSomeNodeEditing(true);
      setTreeData(_treeData);
    },
    [isSomeNodeEditing, treeData, editingTips],
  );

  // 添加子目录
  const handleSubNode = useCallback(
    (key: React.Key) => {
      if (isSomeNodeEditing) {
        message.warn(editingTips);
        return;
      }
      const _treeData = [...treeData];
      addSubNode(_treeData, key);
      setIsSomeNodeEditing(true);
      setTreeData(_treeData);
    },
    [isSomeNodeEditing, treeData, editingTips],
  );

  // 取消输入
  const handleCancel = useCallback(
    (key: React.Key) => {
      const _treeData = [...treeData];
      cancelNode(_treeData, key);
      setIsSomeNodeEditing(false);
      setTreeData(_treeData);
    },
    [treeData],
  );

  // 确认添加操作
  const handleConfirm = useCallback(
    (key: React.Key, val: string) => {
      const _treeData = [...treeData];
      const confirmedNode = confirmAddNode(_treeData, key, val);
      setIsSomeNodeEditing(false);
      setTreeData(_treeData);
      onEdit?.(confirmedNode);
    },
    [onEdit, treeData],
  );

  // 编辑操作
  const handleEditNode = useCallback(
    (key: React.Key) => {
      if (isSomeNodeEditing) {
        message.warn(editingTips);
        return;
      }
      setIsSomeNodeEditing(true);
      const _treeData = [...treeData];
      editNode(_treeData, key);
      setTreeData(_treeData);
    },
    [isSomeNodeEditing, treeData, editingTips],
  );

  useEffect(() => {
    let _treeData;
    try {
      _treeData = JSON.parse(JSON.stringify(originData));
      transferOriginData(_treeData, fieldNames);
    } catch (e) {
      _treeData = [];
    }
    setTreeData(_treeData);
  }, [fieldNames, originData]);

  return (
    <>
      {!!(treeData && treeData.length) && (
        <Tree
          {...rest}
          blockNode
          defaultExpandAll
          treeData={treeData}
          titleRender={
            canEdit
              ? (nodeData) => (
                  <EditableTreeNode
                    title={nodeData.title}
                    primaryKey={nodeData.key}
                    isEditing={nodeData.isEditing}
                    removeTips={removeTips}
                    onRemove={handleRemove}
                    onAddSameLevelNode={handleAddSameLevelNode}
                    onConfirm={handleConfirm}
                    onAddSubNode={handleSubNode}
                    onCancel={handleCancel}
                    onEditNode={handleEditNode}
                  />
                )
              : (nodeData) => nodeData.title
          }
        />
      )}
    </>
  );
};

export default React.memo(EditableTree);
