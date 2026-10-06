"use client";

import { useEffect, useState } from "react";
import { Canal, Etiqueta, NovoPost, Post, Produto, StatusPost, TipoPost } from "@/lib/types";
import { LABEL_CANAL, LABEL_STATUS, LABEL_TIPO } from "@/lib/postStyles";
import { corTextoContraste } from "@/lib/etiquetaCores";
import EtiquetaPicker from "./EtiquetaPicker";

function valoresIniciais(dataPadrao: string): NovoPost {
  return {
    titulo: "",
    data: dataPadrao,
    canal: "instagram",
    tipo: "produto",
    categoria: "",
    video_pronto: false,
    novo_produto: false,
    status: "pendente",
    copy: "",
    observacoes: "",
    produto_id: null,
  };
}

export default function PostModal({
  post,
  dataPadrao,
  etiquetas,
  produtos,
  sugestoesProdutos,
  onFechar,
  onSalvar,
  onExcluir,
  onDuplicar,
  onCriarEtiqueta,
  onEditarEtiqueta,
  onExcluirEtiqueta,
  onCriarProduto,
}: {
  post: Post | null;
  dataPadrao: string;
  etiquetas: Etiqueta[];
  produtos: Produto[];
  sugestoesProdutos: string[];
  onFechar: () => void;
  onSalvar: (id: string | null, valores: NovoPost, etiquetaIds: string[]) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
  onDuplicar: (post: Post) => void;
  onCriarEtiqueta: (nome: string, cor: string) => Promise<Etiqueta>;
  onEditarEtiqueta: (id: string, nome: string, cor: string) => Promise<void>;
  onExcluirEtiqueta: (id: string) => Promise<void>;
  onCriarProduto: (nome: string) => Promise<Produto>;
}) {
  const [valores, setValores] = useState<NovoPost>(
    post
      ? {
          titulo: post.titulo,
          data: post.data,
          canal: post.canal,
          tipo: post.tipo,
          categoria: post.categoria ?? "",
          video_pronto: post.video_pronto,
          novo_produto: post.novo_produto,
          status: post.status,
          copy: post.copy ?? "",
          observacoes: post.observacoes ?? "",
          produto_id: post.produto_id,
        }
      : valoresIniciais(dataPadrao)
  );
  const [etiquetaIds, setEtiquetaIds] = useState<string[]>(post?.etiqueta_ids ?? []);
  // Campo de texto do Produto — separado de `valores.produto_id` porque a
  // pessoa pode digitar o nome de um produto que ainda não existe; só vira
  // um produto_id de verdade (existente ou recém-criado) no momento de
  // salvar, ver `salvar()`.
  const [nomeProduto, setNomeProduto] = useState(
    () => produtos.find((p) => p.id === post?.produto_id)?.nome ?? ""
  );
  const [pickerAberto, setPickerAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function campo<K extends keyof NovoPost>(chave: K, valor: NovoPost[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  function alternarEtiqueta(id: string) {
    setEtiquetaIds((atual) =>
      atual.includes(id) ? atual.filter((e) => e !== id) : [...atual, id]
    );
  }

  // Um produto só faz sentido pra post tipo produto/lançamento — pra
  // qualquer outro tipo, produto_id fica sempre null (mesmo que o campo
  // tenha algo digitado de antes de trocar o tipo).
  const produtoAplicavel = valores.tipo === "produto" || valores.tipo === "lancamento";

  async function resolverProdutoId(): Promise<string | null> {
    if (!produtoAplicavel) return null;
    const nome = nomeProduto.trim();
    if (!nome) return null;
    const existente = produtos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
    if (existente) return existente.id;
    const novo = await onCriarProduto(nome);
    return novo.id;
  }

  async function salvar() {
    if (!valores.titulo.trim()) return;
    setSalvando(true);
    try {
      const produto_id = await resolverProdutoId();
      await onSalvar(
        post?.id ?? null,
        {
          ...valores,
          categoria: valores.categoria?.trim() ? valores.categoria : null,
          copy: valores.copy?.trim() ? valores.copy : null,
          observacoes: valores.observacoes?.trim() ? valores.observacoes : null,
          produto_id,
        },
        etiquetaIds
      );
    } finally {
      setSalvando(false);
    }
  }

  async function fecharSalvando() {
    if (valores.titulo.trim()) {
      await salvar();
    } else {
      onFechar();
    }
  }

  const etiquetasSelecionadas = etiquetaIds
    .map((id) => etiquetas.find((e) => e.id === id))
    .filter((e): e is Etiqueta => !!e);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="absolute inset-0" onClick={fecharSalvando} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-100">
            {post ? "Editar post" : "Novo post"}
          </h2>
          <button
            onClick={fecharSalvando}
            className="rounded p-1 text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Título
            </label>
            <input
              value={valores.titulo}
              onChange={(e) => campo("titulo", e.target.value)}
              placeholder="Nome do produto ou tema do post"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Data
            </label>
            <input
              type="date"
              value={valores.data}
              onChange={(e) => campo("data", e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Canal
              </label>
              <select
                value={valores.canal}
                onChange={(e) => campo("canal", e.target.value as Canal)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                {(Object.keys(LABEL_CANAL) as Canal[]).map((canal) => (
                  <option key={canal} value={canal}>
                    {LABEL_CANAL[canal]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Tipo
              </label>
              <select
                value={valores.tipo}
                onChange={(e) => campo("tipo", e.target.value as TipoPost)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              >
                {(Object.keys(LABEL_TIPO) as TipoPost[]).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {LABEL_TIPO[tipo]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {produtoAplicavel && (
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Produto
              </label>
              <input
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                placeholder="Buscar produto existente ou digitar um novo"
                list="produtos-cadastrados"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
              />
              <datalist id="produtos-cadastrados">
                {sugestoesProdutos.map((nome) => (
                  <option key={nome} value={nome} />
                ))}
              </datalist>
              <p className="mt-1 text-[11px] text-zinc-500">
                Escolha um produto já cadastrado sempre que existir — evita duplicar o mesmo
                produto com nomes diferentes na Biblioteca. Um nome que não bate com nenhum
                produto existente cria um produto novo ao salvar.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Etiquetas
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {etiquetasSelecionadas.map((et) => (
                <span
                  key={et.id}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                  style={{ backgroundColor: et.cor, color: corTextoContraste(et.cor) }}
                >
                  {et.nome}
                  <button onClick={() => alternarEtiqueta(et.id)} className="opacity-70 hover:opacity-100">
                    ✕
                  </button>
                </span>
              ))}
              <button
                onClick={() => setPickerAberto(true)}
                className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
              >
                + Adicionar
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Status
            </label>
            <select
              value={valores.status}
              onChange={(e) => campo("status", e.target.value as StatusPost)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            >
              {(Object.keys(LABEL_STATUS) as StatusPost[]).map((status) => (
                <option key={status} value={status}>
                  {LABEL_STATUS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Categoria
            </label>
            <input
              value={valores.categoria ?? ""}
              onChange={(e) => campo("categoria", e.target.value)}
              placeholder="Ex: Tendências, Marcenarias, Formobile..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={valores.novo_produto}
                onChange={(e) => campo("novo_produto", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700"
              />
              Produto novo (NOVO)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={valores.video_pronto}
                onChange={(e) => campo("video_pronto", e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700"
              />
              Vídeo já feito
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Copy / roteiro
            </label>
            <textarea
              value={valores.copy ?? ""}
              onChange={(e) => campo("copy", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Observações
            </label>
            <textarea
              value={valores.observacoes ?? ""}
              onChange={(e) => campo("observacoes", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-700 px-5 py-4">
          {post ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onExcluir(post.id)}
                className="rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Excluir
              </button>
              <button
                onClick={() => onDuplicar(post)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
              >
                Duplicar
              </button>
            </div>
          ) : (
            <span />
          )}
          <button
            onClick={fecharSalvando}
            disabled={salvando}
            className="rounded-md bg-oliva px-4 py-2 text-sm font-medium text-white hover:bg-oliva-forte disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Fechar"}
          </button>
        </div>
      </div>

      {pickerAberto && (
        <EtiquetaPicker
          etiquetas={etiquetas}
          selecionadas={etiquetaIds}
          onToggle={alternarEtiqueta}
          onCriar={async (nome, cor) => {
            const nova = await onCriarEtiqueta(nome, cor);
            setEtiquetaIds((atual) => [...atual, nova.id]);
          }}
          onEditar={onEditarEtiqueta}
          onExcluir={async (id) => {
            await onExcluirEtiqueta(id);
            setEtiquetaIds((atual) => atual.filter((e) => e !== id));
          }}
          onFechar={() => setPickerAberto(false)}
        />
      )}
    </div>
  );
}
