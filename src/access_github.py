from git import Repo
import os
from dotenv import load_dotenv

# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()

def push_to_github(repo_path, commit_message):
    try:
        repo_abs_path = os.path.abspath(repo_path)
        repo = Repo(repo_abs_path)

        # Pull pour récupérer les dernières modifications depuis la branche distante
        origin = repo.remotes.origin
        origin.pull()

        # Ajout des fichiers modifiés pour le commit
        repo.git.add('--all')

        # Réalisation du commit
        repo.index.commit(commit_message)

        # Accès au token d'accès personnel depuis les variables d'environnement
        github_token = os.getenv('GITHUB_ACCESS_TOKEN')

        # Vérifier si le remote 'github' existe déjà
        github_remote = None
        for remote in repo.remotes:
            if remote.name == 'github2':
                github_remote = remote
                break

        if github_remote is None:
            # Si le remote 'github' n'existe pas, créer un nouveau remote
            origin_url = repo.remote('origin').url
            auth_url = origin_url.replace('https://', f'https://{github_token}@')
            repo.create_remote('github2', url=auth_url)
            github_remote = repo.remote('github2')

        # Push vers le dépôt distant (github)
        github_remote.push()

        print("Push vers GitHub effectué avec succès.")

    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
push_to_github('/home/IchichTradingPro/Desktop/Trading-Dashboard/', 'Commit automatique via script Python')
