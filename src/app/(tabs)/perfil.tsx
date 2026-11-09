import { useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';

import { BotaoGrande } from '../../components/BotaoGrande';
import { Cartao } from '../../components/Cartao';
import { OpcaoSelecao } from '../../components/OpcaoSelecao';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { usePerfil } from '../../contexts/PerfilContext';
import { colors, fonts, radius, spacing, touch } from '../../theme';
import { Cenario, Modo, Perfil } from '../../types';

export default function PerfilScreen() {
  const { perfil, atualizarPerfil } = usePerfil();
  const [rascunho, setRascunho] = useState<Perfil>(perfil);
  const [perfilBase, setPerfilBase] = useState<Perfil>(perfil);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Quando o perfil salvo no banco termina de carregar, o formulário passa a mostrá-lo
  if (perfilBase !== perfil) {
    setPerfilBase(perfil);
    setRascunho(perfil);
  }

  const alterar = <K extends keyof Perfil>(campo: K, valor: Perfil[K]) => {
    setMensagem(null);
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  };

  async function salvar() {
    if (!rascunho.nome.trim()) {
      setMensagem('Digite um nome para continuar.');
      return;
    }
    setSalvando(true);
    try {
      await atualizarPerfil({ ...rascunho, nome: rascunho.nome.trim() });
      setMensagem('Pronto! Suas preferências foram salvas.');
    } catch {
      setMensagem('Não foi possível salvar. Tente de novo.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Cartao>
        <Texto variante="subtitulo">Quem está usando o app?</Texto>
        <OpcaoSelecao<Modo>
          selecionado={rascunho.modo}
          onSelecionar={(modo) => alterar('modo', modo)}
          opcoes={[
            { valor: 'IDOSO', rotulo: 'Sou a pessoa idosa', descricao: 'Vejo o calor da casa e aviso que estou bem' },
            { valor: 'FAMILIA', rotulo: 'Sou da família', descricao: 'Acompanho a casa e recebo alertas' },
            { valor: 'AGENTE', rotulo: 'Sou agente de saúde (UBS)', descricao: 'Vejo a lista de visitas prioritárias' },
          ]}
        />
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Seus dados</Texto>
        <Campo rotulo="Seu nome" valor={rascunho.nome} onChange={(v) => alterar('nome', v)} />
        <Campo rotulo="Contato da família" valor={rascunho.contatoNome} onChange={(v) => alterar('contatoNome', v)} />
        <Campo
          rotulo="Telefone do contato"
          valor={rascunho.contatoTelefone}
          onChange={(v) => alterar('contatoTelefone', v)}
          teclado="phone-pad"
        />
        <Texto variante="apoio">Use dados fictícios: este app é um protótipo acadêmico.</Texto>
      </Cartao>

      <Cartao>
        <Texto variante="subtitulo">Simulação (para demonstração)</Texto>
        <Texto variante="apoio">Escolha a situação da casa que o sensor simulado vai mostrar.</Texto>
        <OpcaoSelecao<Cenario>
          selecionado={rascunho.cenario}
          onSelecionar={(cenario) => alterar('cenario', cenario)}
          opcoes={[
            { valor: 'NORMAL', rotulo: 'Dia tranquilo', descricao: 'Casa fresca, sem alertas' },
            { valor: 'CAUTELA', rotulo: 'Dia quente', descricao: 'Cautela extrema e sem água há 2h' },
            { valor: 'PERIGO', rotulo: 'Dia de perigo', descricao: 'Calor perigoso e sem movimento há 2h' },
          ]}
        />
        <View style={styles.linhaSwitch}>
          <View style={styles.textoSwitch}>
            <Texto>Simular falha do servidor</Texto>
            <Texto variante="apoio">Mostra como o app se comporta sem conexão com a API.</Texto>
          </View>
          <Switch
            value={rascunho.simularFalha}
            onValueChange={(v) => alterar('simularFalha', v)}
            trackColor={{ true: colors.primary, false: colors.border }}
            accessibilityLabel="Simular falha do servidor"
          />
        </View>
      </Cartao>

      {mensagem ? (
        <Texto accessibilityLiveRegion="polite" cor={mensagem.startsWith('Pronto') ? colors.success : colors.danger}>
          {mensagem}
        </Texto>
      ) : null}
      <BotaoGrande rotulo="Salvar" icone="save" carregando={salvando} onPress={salvar} tamanho="grande" />
    </Tela>
  );
}

interface CampoProps {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  teclado?: 'default' | 'phone-pad';
}

function Campo({ rotulo, valor, onChange, teclado = 'default' }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Texto variante="apoio">{rotulo}</Texto>
      <TextInput
        value={valor}
        onChangeText={onChange}
        keyboardType={teclado}
        style={styles.input}
        accessibilityLabel={rotulo}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { gap: spacing.xs },
  input: {
    minHeight: touch.min,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: fonts.size.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  linhaSwitch: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  textoSwitch: { flex: 1 },
});
