import Link from 'next/link';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-4">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ServiçosApp</h1>
          <div className="space-x-4">
            <Link href="/login" className="hover:underline">
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cadastrar
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Encontre os Melhores Prestadores de Serviços
          </h2>
          <p className="text-xl text-gray-600">
            Conecte-se com profissionais qualificados na sua região
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
            <p className="text-gray-600">Reserve serviços em poucos cliques</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Profissionais Verificados</h3>
            <p className="text-gray-600">Todos os prestadores são avaliados</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Pagamento Seguro</h3>
            <p className="text-gray-600">Sistema de pagamento protegido</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block"
          >
            Começar Agora
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
