import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Key } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Dropdown, Input, message, Popconfirm, Row } from "antd";
import css from "./index.module.less";
import { useHover } from "ahooks";

export type EditableTreeNodeProps = {
  primaryKey: React.Key;
  title: string;
  isEditing: boolean;
  removeTips?: string;
  onRemove: (key: Key) => void;
  onAddSameLevelNode: (key: Key) => void;
  onAddSubNode: (key: Key) => void;
  onConfirm: (key: React.Key, val: string) => void;
  onCancel: (key: Key) => void;
  onEditNode: (key: Key) => void;
};

const EditableTreeNode: React.FC<EditableTreeNodeProps> = ({
  primaryKey: key,
  title,
  isEditing,
  removeTips,
  onRemove,
  onAddSameLevelNode,
  onConfirm,
  onAddSubNode,
  onCancel,
  onEditNode,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const ref = useRef<any>();
  const isHover = useHover(ref);
  useEffect(() => {
    if (title) {
      setInputValue(title);
    }
  }, [title]);

  const menu = useMemo(
    () => (
      <div className={css.dropdownMenu}>
        <p onClick={() => onAddSameLevelNode(key)}>添加同级目录</p>
        <p className="lastItem" onClick={() => onAddSubNode(key)}>
          添加子目录
        </p>
      </div>
    ),
    [key, onAddSameLevelNode, onAddSubNode]
  );

  return (
    <Row ref={ref}>
      {isEditing ? (
        <div key={key} className={css.editingNode}>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          <CheckOutlined
            onClick={e => {
              e.stopPropagation();
              if (inputValue == "") {
                message.warn("请输入节点名称");
                return;
              }
              onConfirm?.(key, inputValue);
            }}
          />
          <CloseOutlined
            onClick={e => {
              e.stopPropagation();
              onCancel?.(key);
            }}
          />
        </div>
      ) : (
        <div key={key} className={css.displayedNode}>
          <label>{title}</label>
          <div
            className="operations"
            style={{ display: isHover ? "inline-block" : "none" }}
          >
            <Popconfirm title={removeTips} onConfirm={() => onRemove(key)}>
              <DeleteOutlined onClick={e => e.stopPropagation()} />
            </Popconfirm>
            <EditOutlined
              onClick={e => {
                e.stopPropagation();
                onEditNode?.(key);
              }}
            />
            <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
              <PlusOutlined
                onClick={e => {
                  e.stopPropagation();
                }}
              />
            </Dropdown>
          </div>
        </div>
      )}
    </Row>
  );
};

export default React.memo(EditableTreeNode);
