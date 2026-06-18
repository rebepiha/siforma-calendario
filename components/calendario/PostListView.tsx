"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Etiqueta, Post } from "@/lib/types";
import { CORES_CANAL, CORES_STATUS, CORES_TIPO, LABEL_CANAL, LABEL_STATUS, LABEL_TIPO } from "@/lib/postStyles";
import { corTextoContraste } from "@/lib/etiquetaCores";

export default function PostListView({
  posts,
  etiquetas,
  onClickPost,
}: {
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 py-12 text-center text-sm text-zinc-500">
        Nenhum post neste período.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-3 py-2.5 font-semibold">Data</th>
            <th className="px-3 py-2.5 font-semibold">Post</th>
            <th className="px-3 py-2.5 font-semibold">Canal</th>
            <th className="px-3 py-2.5 font-semibold">Tipo</th>
            <th className="px-3 py-2.5 font-semibold">Etiquetas</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const etiquetasDoPost = post.etiqueta_ids
              .map((id) => etiquetas.find((e) => e.id === id))
              .filter((e): e is Etiqueta => !!e);
            return (
              <tr
                key={post.id}
                onClick={() => onClickPost(post)}
                className="cursor-pointer border-t border-zinc-700 hover:bg-white/5"
              >
                <td className="whitespace-nowrap px-3 py-2.5 capitalize text-zinc-400">
                  {format(parseISO(post.data), "dd/MM · EEE", { locale: ptBR })}
                </td>
                <td className="px-3 py-2.5 font-medium text-zinc-100">{post.titulo}</td>
                <td className={`px-3 py-2.5 font-medium ${CORES_CANAL[post.canal].text}`}>
                  {LABEL_CANAL[post.canal]}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className="rounded px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${CORES_TIPO[post.tipo]}33`,
                      color: CORES_TIPO[post.tipo],
                    }}
                  >
                    {LABEL_TIPO[post.tipo]}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {etiquetasDoPost.map((et) => (
                      <span
                        key={et.id}
                        className="rounded px-1.5 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: et.cor, color: corTextoContraste(et.cor) }}
                      >
                        {et.nome}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-zinc-300">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CORES_STATUS[post.status] }}
                    />
                    {LABEL_STATUS[post.status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
