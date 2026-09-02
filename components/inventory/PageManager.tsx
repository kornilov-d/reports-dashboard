"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Folder,
  FrameIcon,
  IconBadge,
  IconTicket,
  IconTicket2,
  Plus,
  Trash,
} from "@/components/icons";
import Button from "@/components/ui/Button";
import InlineEdit from "@/components/ui/InlineEdit";

type ItemKind = "discount" | "ticket-grid" | "ticket-row";
type NodeType = "section" | "group" | "item";
type TreeNode = {
  id: string;
  type: NodeType;
  label: string;
  itemKind?: ItemKind;
  children?: TreeNode[];
};

type DropPos = "before" | "after" | "inside";

const INITIAL: TreeNode[] = [
  {
    id: "tickets",
    type: "section",
    label: "Tickets",
    children: [
      { id: "g-vip", type: "group", label: "VIP", children: [] },
      { id: "g-gold", type: "group", label: "Gold", children: [] },
      {
        id: "g-silver",
        type: "group",
        label: "Silver",
        children: [
          { id: "i-silver-offer", type: "item", label: "Silver Offer", itemKind: "discount" },
          { id: "i-ga", type: "item", label: "General Admission", itemKind: "ticket-grid" },
          { id: "i-two", type: "item", label: "Two tickets", itemKind: "ticket-row" },
        ],
      },
    ],
  },
  {
    id: "vouchers",
    type: "section",
    label: "Vouchers",
    children: [
      { id: "v-vip", type: "group", label: "VIP", children: [] },
      { id: "v-gold", type: "group", label: "Gold", children: [] },
      { id: "v-silver", type: "group", label: "Silver", children: [] },
    ],
  },
];

let counter = 0;
function uid(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/* ---------- tree helpers (immutable) ---------- */

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function isDescendant(node: TreeNode, id: string): boolean {
  if (node.id === id) return true;
  return (node.children ?? []).some((c) => isDescendant(c, id));
}

function removeNode(nodes: TreeNode[], id: string): TreeNode[] {
  const out: TreeNode[] = [];
  for (const n of nodes) {
    if (n.id === id) continue;
    out.push(n.children ? { ...n, children: removeNode(n.children, id) } : n);
  }
  return out;
}

function renameNode(nodes: TreeNode[], id: string, label: string): TreeNode[] {
  return nodes.map((n) =>
    n.id === id
      ? { ...n, label }
      : n.children
        ? { ...n, children: renameNode(n.children, id, label) }
        : n,
  );
}

function insertNode(
  nodes: TreeNode[],
  node: TreeNode,
  targetId: string,
  pos: DropPos,
): TreeNode[] {
  const out: TreeNode[] = [];
  for (const n of nodes) {
    const isTarget = n.id === targetId;
    if (isTarget && pos === "before") out.push(node);

    if (isTarget && pos === "inside") {
      out.push({ ...n, children: [...(n.children ?? []), node] });
    } else if (n.children) {
      out.push({ ...n, children: insertNode(n.children, node, targetId, pos) });
    } else {
      out.push(n);
    }

    if (isTarget && pos === "after") out.push(node);
  }
  return out;
}

type FlatRow = { node: TreeNode; depth: number };

function flatten(
  nodes: TreeNode[],
  expanded: Record<string, boolean>,
  depth = 0,
): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const n of nodes) {
    rows.push({ node: n, depth });
    const open = n.type === "section" || expanded[n.id];
    if (n.children && open) {
      rows.push(...flatten(n.children, expanded, depth + 1));
    }
  }
  return rows;
}

/* ---------- presentational bits ---------- */

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mute-2)]" />;
}

function itemIcon(kind?: ItemKind) {
  if (kind === "discount") return <IconBadge size={16} />;
  if (kind === "ticket-grid") return <IconTicket size={16} />;
  if (kind === "ticket-row") return <IconTicket2 size={16} />;
  return <IconTicket size={16} />;
}

const INDENT = 44;

function AddMenu({
  onAddSection,
  onAddGroup,
}: {
  onAddSection: () => void;
  onAddGroup: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        trailing={<ChevronDown size={16} />}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      >
        Add
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onAddSection();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] hover:bg-[var(--color-line-2)]"
          >
            <FrameIcon size={15} className="text-[var(--color-mute)]" />
            <div>
              <p className="font-medium">Section</p>
              <p className="text-[12px] text-[var(--color-mute)]">First level</p>
            </div>
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onAddGroup();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] hover:bg-[var(--color-line-2)]"
          >
            <Folder size={15} className="text-[var(--color-mute)]" />
            <div>
              <p className="font-medium">Group</p>
              <p className="text-[12px] text-[var(--color-mute)]">Second level folder</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function PageManager() {
  const [tree, setTree] = useState<TreeNode[]>(INITIAL);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "g-silver": true,
    "v-silver": true,
  });
  const [dragId, setDragId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ targetId: string; pos: DropPos } | null>(
    null,
  );
  const draggedRef = useRef<TreeNode | null>(null);

  const count = (function countAll(nodes: TreeNode[]): number {
    return nodes.reduce(
      (n, x) => n + 1 + (x.children ? countAll(x.children) : 0),
      0,
    );
  })(tree);

  const rows = flatten(tree, expanded);

  // Resolve placeholder insertion point in the flat list.
  let phIndex = -1;
  let phDepth = 0;
  let ringId: string | null = null;
  if (dragId && drop) {
    const ti = rows.findIndex((r) => r.node.id === drop.targetId);
    if (ti >= 0) {
      const td = rows[ti].depth;
      let end = ti + 1;
      while (end < rows.length && rows[end].depth > td) end++;
      if (drop.pos === "before") {
        phIndex = ti;
        phDepth = td;
      } else if (drop.pos === "after") {
        phIndex = end;
        phDepth = td;
      } else {
        phIndex = end;
        phDepth = td + 1;
        ringId = drop.targetId;
      }
    }
  }

  function toggle(id: string) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  function remove(id: string) {
    setTree((t) => removeNode(t, id));
  }

  function rename(id: string, label: string) {
    setTree((t) => renameNode(t, id, label));
  }

  function onDragStart(e: React.DragEvent, node: TreeNode) {
    setDragId(node.id);
    draggedRef.current = node;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", node.id);
  }

  function onDragOverRow(e: React.DragEvent, row: FlatRow) {
    e.preventDefault();
    const dragged = draggedRef.current;
    if (!dragged) return;
    // Can't drop onto self or into own subtree.
    if (isDescendant(dragged, row.node.id)) {
      setDrop(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    const isFolder = row.node.type !== "item";
    let pos: DropPos;
    if (isFolder) {
      if (y < h * 0.28) pos = "before";
      else if (y > h * 0.72) pos = "after";
      else pos = "inside";
    } else {
      pos = y < h * 0.5 ? "before" : "after";
    }
    setDrop((prev) =>
      prev && prev.targetId === row.node.id && prev.pos === pos
        ? prev
        : { targetId: row.node.id, pos },
    );
  }

  function onDrop() {
    const dragged = draggedRef.current;
    if (dragged && drop && !isDescendant(dragged, drop.targetId)) {
      const without = removeNode(tree, dragged.id);
      setTree(insertNode(without, dragged, drop.targetId, drop.pos));
      // ensure the destination folder is expanded so the move is visible
      if (drop.pos === "inside") {
        setExpanded((ex) => ({ ...ex, [drop.targetId]: true }));
      }
    }
    endDrag();
  }

  function endDrag() {
    setDragId(null);
    setDrop(null);
    draggedRef.current = null;
  }

  function addSection() {
    setTree((t) => [
      ...t,
      { id: uid("section"), type: "section", label: "New section", children: [] },
    ]);
  }

  function addGroup() {
    setTree((t) => {
      const firstSection = t.find((n) => n.type === "section");
      if (!firstSection) return t;
      const g: TreeNode = {
        id: uid("group"),
        type: "group",
        label: "New group",
        children: [],
      };
      return t.map((n) =>
        n.id === firstSection.id
          ? { ...n, children: [...(n.children ?? []), g] }
          : n,
      );
    });
  }

  function Placeholder({ depth }: { depth: number }) {
    return (
      <div style={{ paddingLeft: depth * INDENT }}>
        <div className="h-10 rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-line-2)]" />
      </div>
    );
  }

  return (
    <section onDragEnd={endDrag}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-[22px] font-bold tracking-tight">
          Page Manager
          <span className="text-[14px] font-medium text-[var(--color-mute)]">
            {count}
          </span>
        </h2>
        <AddMenu onAddSection={addSection} onAddGroup={addGroup} />
      </div>

      <div className="mt-6 space-y-1" onDragOver={(e) => e.preventDefault()}>
        {rows.map((row, i) => {
          const { node, depth } = row;
          const isSection = node.type === "section";
          const isGroup = node.type === "group";
          const draggable = !isSection;
          const open = expanded[node.id];
          const isDragging = dragId === node.id;
          const isRing = ringId === node.id;

          return (
            <div key={node.id}>
              {phIndex === i && <Placeholder depth={phDepth} />}

              {isSection ? (
                <div
                  onDragOver={(e) => onDragOverRow(e, row)}
                  onDrop={onDrop}
                  className={[
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2.5",
                    isRing
                      ? "ring-2 ring-[var(--color-platinum-haze)]"
                      : "",
                  ].join(" ")}
                >
                  <FrameIcon size={15} className="text-[var(--color-mute)]" />
                  <div className="min-w-0 flex-1">
                    <InlineEdit
                      value={node.label}
                      onCommit={(v) => rename(node.id, v)}
                      ariaLabel="Edit section name"
                      className="text-[14px] font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Delete section"
                    onClick={() => remove(node.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] opacity-0 transition-opacity hover:bg-[#fce8e8] group-hover:opacity-100"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ) : (
                <div
                  draggable={draggable && editingId !== node.id}
                  onDragStart={(e) => onDragStart(e, node)}
                  onDragOver={(e) => onDragOverRow(e, row)}
                  onDrop={onDrop}
                  className={[
                    "group flex items-center rounded-lg border py-2.5 pr-3 transition-colors",
                    isRing
                      ? "border-[var(--color-platinum-haze)] ring-1 ring-[var(--color-platinum-haze)]"
                      : "border-transparent",
                    isDragging ? "opacity-40" : "",
                    "cursor-grab active:cursor-grabbing hover:bg-[var(--color-line-2)]",
                  ].join(" ")}
                >
                  {/* nesting dots */}
                  <div className="flex shrink-0">
                    {Array.from({ length: depth }).map((_, d) => (
                      <span
                        key={d}
                        className="flex items-center justify-center"
                        style={{ width: INDENT }}
                      >
                        <Dot />
                      </span>
                    ))}
                  </div>

                  <span className="mr-2.5 text-[var(--color-mute)]">
                    {isGroup ? <Folder size={16} /> : itemIcon(node.itemKind)}
                  </span>
                  {isGroup ? (
                    <div className="min-w-0 flex-1">
                      <InlineEdit
                        value={node.label}
                        onCommit={(v) => rename(node.id, v)}
                        onEditingChange={(ed) =>
                          setEditingId(ed ? node.id : null)
                        }
                        ariaLabel="Edit folder name"
                        className="text-[14px]"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 text-[14px]">{node.label}</span>
                  )}

                  {isGroup && (
                    <button
                      type="button"
                      aria-label="Delete group"
                      onClick={() => remove(node.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] opacity-0 transition-opacity hover:bg-[#fce8e8] group-hover:opacity-100"
                    >
                      <Trash size={15} />
                    </button>
                  )}

                  {isGroup && (
                    <button
                      type="button"
                      aria-label="Toggle"
                      onClick={() => toggle(node.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-white"
                    >
                      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {phIndex === rows.length && <Placeholder depth={phDepth} />}
      </div>
    </section>
  );
}
