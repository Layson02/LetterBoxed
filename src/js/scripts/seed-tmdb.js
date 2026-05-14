import { SeedService } from '../api/useCases/SeedService.js';

async function rodarSeed() {
    try {
        console.log('=== Iniciando Seed via CLI ===');
        const seedService = new SeedService();
        // Rodar 5 páginas por padrão via CLI
        const resultado = await seedService.executarSeed(5);
        console.log('=== Seed Concluído com Sucesso ===');
        console.log(`Total de filmes processados: ${resultado.totalProcessado}`);
        process.exit(0);
    } catch (error) {
        console.error('Erro ao executar seed via CLI:', error);
        process.exit(1);
    }
}

rodarSeed();
