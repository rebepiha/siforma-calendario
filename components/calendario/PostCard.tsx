"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format, parseISO } from "date-fns";
import { Etiqueta, Post, StatusPost } from "@/lib/types";
import { CORES_CANAL, CORES_TIPO, LABEL_TIPO } from "@/lib/postStyles";
import { corAvatar, inicialAvatar } from "@/lib/avatar";

function IconeFormato({ nome }: { nome: string }) {
  const chave = nome.toLowerCase();
  if (chave.includes("reel")) {
    return (
      <svg viewBox="0 0 16 16" fill="white" className="h-2.5 w-2.5">
        <path d="M4 2.5l9 5.5-9 5.5v-11z" />
      </svg>
    );
  }
  if (chave.includes("carrossel")) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
        <rect x="1" y="3" width="8" height="10" rx="1.5" stroke="white" strokeWidth="1.4" />
        <path d="M11.5 5v6M14 6v4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (chave.includes("stor")) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (chave.includes("enquete") || chave.includes("quiz") || chave.includes("pergunta")) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
        <path
          d="M5.5 6a2.5 2.5 0 1 1 3.7 2.2c-.7.4-1.2.8-1.2 1.6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="12.2" r="0.9" fill="white" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.4" />
    </svg>
  );
}

function tagPrincipal(post: Post): { texto: string; cor: string } {
  if (post.status === "publicado") {
    return { texto: `Publicado ${format(parseISO(post.data), "dd/MM")}`, cor: "#4ade80" };
  }
  if (post.tipo === "evento" && post.categoria && post.categoria.length <= 24) {
    return { texto: post.categoria, cor: CORES_TIPO.evento };
  }
  return { texto: LABEL_TIPO[post.tipo], cor: CORES_TIPO[post.tipo] };
}

export default function PostCard({
  post,
  etiquetas,
  onClick,
  onChangeStatus,
}: {
  post: Post;
  etiquetas: Etiqueta[];
  onClick: () => void;
  onChangeStatus: (id: string, status: StatusPost) => void;
}) {
  const etiquetaPrincipal = post.etiqueta_ids
    .map((id) => etiquetas.find((e) => e.id === id))
    .find((e): e is Etiqueta => !!e);
  const corPrincipal = etiquetaPrincipal?.cor ?? CORES_CANAL[post.canal].dot;
  const publicado = post.status === "publicado";
  const tag = tagPrincipal(post);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: post.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`flex cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/10 text-left shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="w-1 shrink-0" style={{ backgroundColor: corPrincipal }} />

      <div className="relative flex-1 px-2 py-1.5">
        {post.novo_produto && (
          <span className="absolute -top-2 -right-2 rounded-full bg-badge-novo px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            NOVO
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={publicado}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onChangeStatus(post.id, publicado ? "pendente" : "publicado");
            }}
            title="Postado/finalizado"
            className="h-3.5 w-3.5 shrink-0 rounded border-zinc-500"
          />
          {etiquetaPrincipal && (
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: corPrincipal }}
            >
              <IconeFormato nome={etiquetaPrincipal.nome} />
            </span>
          )}
          <span className="truncate text-[11px] font-medium" style={{ color: corPrincipal }}>
            {etiquetaPrincipal?.nome ?? "Post"}
          </span>
        </div>

        <p className="text-sm font-semibold leading-snug text-zinc-100">{post.titulo}</p>

        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span
            className="truncate rounded px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${tag.cor}33`, color: tag.cor }}
          >
            {tag.texto}
          </span>
          {post.responsavel && (
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: corAvatar(post.responsavel) }}
              title={post.responsavel}
            >
              {inicialAvatar(post.responsavel)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
