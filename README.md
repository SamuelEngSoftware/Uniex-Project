[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20877800)
# :checkered_flag: UniEx

O UniEx é uma plataforma web full-stack que serve como uma ponte entre a universidade e a comunidade. O sistema permite que coordenadores e professores divulguem e gerenciem cursos, oficinas e workshops de extensão, enquanto o público geral pode facilmente encontrar, se inscrever e participar dessas oportunidades de aprendizado.


## :technologist: Membros da equipe

553382 - Francisco Samuel Cabral Leitão - Engenharia de Software

## :bulb: Objetivo Geral
Centralizar, simplificar e ampliar o alcance das atividades de extensão universitária, oferecendo uma ferramenta intuitiva para a gestão de cursos por parte da instituição e um canal de acesso facilitado para a comunidade interessada em participar e adquirir novos conhecimentos.


## :eyes: Público-Alvo
Pessoas da cidade em geral, alunos, servidores da universidade que desejam participar das atividades de extensão. Docentes responsavéis por criar, organizar e ministrar os cursos e eventos de extensão.

## :star2: Impacto Esperado
Espera-se que o projeto aumente a visibilidade e o engajamento nos programas de extensão da universidade. Para o público, o impacto é a democratização do acesso ao conhecimento acadêmico. Para a universidade, o impacto é a otimização dos processos de gestão, a automação das inscrições e a capacidade de mensurar o alcance de suas iniciativas de extensão, fortalecendo sua relação com a sociedade.


## :people_holding_hands: Papéis ou tipos de usuário da aplicação

Visitante (usuário não logado): Qualquer pessoa que acessa a plataforma sem realizar login.

Participante: Usuário cadastrado e logado na plataforma, interessado em participar dos cursos (aluno da universidade ou membro da comunidade externa).

Coordenador: Usuário com permissões para criar e gerenciar seus próprios cursos e as inscrições vinculadas a eles.

Administrador: Superusuário com controle total sobre a plataforma, incluindo a gestão de todos os cursos, usuários e permissões.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

Funcionalidades Públicas (Acessíveis a todos)
Visualização da página inicial com cursos em destaque.

Listagem de todos os cursos disponíveis com sistema de busca e filtros (por área, data, etc.).

Visualização da página de detalhes de um curso (descrição, vagas, datas, coordenador responsável).

Página de cadastro de novos usuários (Participantes).

Página de login.

Funcionalidades Restritas (Acessíveis a usuários logados)
Para Participantes:

Inscrever-se em um curso.

Cancelar uma inscrição.

Acessar um painel pessoal para visualizar o histórico de cursos inscritos.

Editar as próprias informações de perfil.

Para Coordenadores (Professores):

Todas as funcionalidades de um Participante.

Painel de gerenciamento para criar, editar e excluir seus próprios cursos (CRUD de Course).

Visualizar a lista de inscritos em seus cursos.


Para Administradores:

Todas as funcionalidades de um Coordenador.

Painel de administração geral para visualizar e gerenciar todos os cursos da plataforma.

Gerenciar todos os usuários do sistema (visualizar, editar, deletar e alterar papéis).

Visualizar estatísticas gerais da plataforma.
## :spiral_calendar: Entidades ou tabelas do sistema

Liste as principais entidades do sistema.

User: Armazena os dados dos usuários da plataforma.

Course: Armazena as informações dos cursos de extensão. Esta entidade é dependente de User, pois cada curso tem um responsável.

Subscription: Tabela de associação que registra a inscrição de um usuário em um curso.

