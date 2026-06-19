"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { MouseEvent } from "react";
import { ptBR } from "date-fns/locale";
import { Etiqueta, Post } from "@/lib/types";
import DayCell from "./DayCell";
import PostCard from "./PostCard";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarGrid({
  mesAtual,
  posts,
  etiquetas,
  onClickPost,
  onNovoPost,
  onToggleStatus,
  onContextMenuPost,
}: {
  mesAtual: Date;
  posts: Post[];
  etiquetas: Etiqueta[];
  onClickPost: (post: Post) => void;
  onNovoPost: (data: string) => void;
  onToggleStatus: (post: Post) => void;
  onContextMenuPost: (e: MouseEvent, post: Post) => void;
}) {
  const inicioGrade = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 1 });
  const fimGrade = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 1 });

  const dias: Date[] = [];
  for (let dia = inicioGrade; dia <= fimGrade; dia = addDays(dia, 1)) {
    dias.push(dia);
  }

  const hoje = new Date();

  const diasDoMesComPosts = dias
    .filter((dia) => isSameMonth(dia, mesAtual))
    .map((dia) => {
      const dataStr = format(dia, "yyyy-MM-dd");
      const postsDoDia = posts
        .filter((p) => p.data === dataStr)
        .sort((a, b) => a.ordem - b.ordem);
      return { dia, dataStr, postsDoDia };
    })
    .filter(({ postsDoDia }) => postsDoDia.length > 0);

  return (
    <>
      {/* Telas largas: grade do mês inteiro, 7 colunas. */}
      <div className="hidden overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm sm:block">
        <div className="grid grid-cols-7 border-b border-zinc-700 bg-zinc-900 text-center text-xs font-semibold text-zinc-500">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="py-2">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {dias.map((dia) => {
            const dataStr = format(dia, "yyyy-MM-dd");
            const postsDoDia = posts
              .filter((p) => p.data === dataStr)
              .sort((a, b) => a.ordem - b.ordem);
            return (
              <DayCell
                key={dataStr}
                dataStr={dataStr}
                numeroDia={dia.getDate()}
                foraDoMes={!isSameMonth(dia, mesAtual)}
                ehHoje={isSameDay(dia, hoje)}
                posts={postsDoDia}
                etiquetas={etiquetas}
                onClickPost={onClickPost}
                onNovoPost={onNovoPost}
                onToggleStatus={onToggleStatus}
                onContextMenuPost={onContextMenuPost}
              />
            );
          })}
        </div>
      </div>

      {/* Telas estreitas: lista vertical, só os dias com post, cards em largura cheia. */}
      <div className="flex flex-col gap-4 sm:hidden">
        {diasDoMesComPosts.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-600">
            Nenhum post neste mês.
          </p>
        ) : (
          diasDoMesComPosts.map(({ dia, dataStr, postsDoDia }) => (
            <div key={dataStr} className="flex flex-col gap-2">
              <button
                onClick={() => onNovoPost(dataStr)}
                className={`flex items-center gap-2 self-start rounded-md px-2 py-1 text-sm font-semibold ${
                  isSameDay(dia, hoje) ? "bg-oliva text-white" : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                {dia.getDate()} de {format(dia, "MMMM", { locale: ptBR })}
                <span className="text-zinc-500">+</span>
              </button>
              <div className="flex flex-col gap-1.5">
                {postsDoDia.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    etiquetas={etiquetas}
                    onClick={() => onClickPost(post)}
                    onToggleStatus={() => onToggleStatus(post)}
                    onContextMenu={(e) => onContextMenuPost(e, post)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
