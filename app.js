import './style.css'

import { gsap } from 'gsap'; 
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip, GSDevTools);


//vamos criar várias funções para as diferentes partes da animação, fica mais fácil o entendimento e o código fica mais bem estruturado e fácil de ler e, caso necessário, mais fácil de resolver erros e/ou bugs

//muita coisa no html ta dentro de um span, ou de outra tag, usamos isso pra na tag de fora colocar um overflow hidden e na tag de dentro mexer e animar com o gsap mudando o translateY ou X de cada elemento

const preloaderBackground = document.querySelector('.preloader__background'); //fundo
const preloaderText = document.querySelector('.preloader__text span'); //selecioanr o span
const heroTitles = document.querySelectorAll('.hero__title span span'); //selecionando o span
const heroImagemStart = document.querySelector('.hero-image-start'); //imagem inicial da sec hero
const heroCaption = document.querySelector('.hero__caption span'); // legendinha da sec hero
const heroButton = document.querySelector('.hero__button'); //selecionar o botão da sec hero
const heroImageWrapper = document.querySelector('.hero__image');
const heroImage = document.querySelector('.hero__image img');
const headerItems = document.querySelectorAll('.header *');

const master = gsap.timeline(); //criamos uma timeline que podemos adicionar cada função ou outras timelines a ele, pra deixar o projeto mais estruturado

//precisamos dizer para o gsap onde cada elemento que será usado o translate está, ai vamos fazer isso com essa função
const setInitialStates = () => {

    gsap.set(headerItems, {
        y: 24,
        autoAlpha: 0,
    });

    gsap.set(heroButton, {
        y: 64, //o Y é a posição de altura, na vertical né
        autoAlpha: 0, //o autoAlpha é pra esconder ele, no 0 ele fica invisivel na tela, podemos colocar 1 para ficar mais facil de se localizar e depois mudar pra 0, isso que vai fazer a animação acontecer, iniciar escondido e ir aparecendo
    })

    gsap.set([preloaderText, heroTitles, heroCaption], {
        yPercent: 100, //aqui esses elementos tem uma tag envolvendo eles com o overflow hidden, entao o yPercent move eles pra baixo e a tag envolvendo eles esconde eles, ai quando animar pra cima da a sensação de entrada
    });
};


const preloaderAnimation = () => {
    const tl = gsap.timeline({
        defaults: {
            ease: 'power2.out',
        }
    }); //criar uma timeline e colocamos que a propriedade ease, que é a suavidade da animação, é, por padrão, ease-out (tipo no css) na 'potência'/'força' 2, poderíamos aumentar a força ou mudar o estilo da animação para o nosso gosto!

    //adicionando as animações a timeline que acabamos de criar
    tl.to(preloaderText, {
        yPercent: 0, //definir a porcentagem do translateY do elemento
        delay: 0.3, //definir quanto tempo demora pra iniciar a animação
        //como não definimos nada, a suavidade é POR PADRÃO power2.out.
    })
    .to(preloaderText, {
        yPercent: -105,
        delay: 1,
    })
    .to(preloaderBackground, {
        yPercent: -100,
        duration: 1.5,
        ease: 'power4.inOut', //aqui definimos uma suavidade específica e diferente da padrão, que sobrepõe!
    })

    return tl; //retornamos a timeline com tudo necessário adicionado
}

const heroImageAnimation = () => {
    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.inOut',
            duration: 2,
        }
    });


    const state = Flip.getState(heroImageWrapper); //pega o state do imagewrapper
    heroImagemStart.appendChild(heroImageWrapper); //adicionanmos a imagem dentro do start, que é onde ela deve estar

    //aqui estaria tudo acontecendo com a duração, que definimos no default que é 2. Então cada animação dura 2 segundos mas uma só inicia depois que a outra termina. Para que isso não ocorra podemos fazer um overlap, somente adicinamos um parâmetro a mais na função que isso é resolvido. '<' como novo parâmetro para as funções.
    tl.from(heroImage, {
        scale: 1.02,
    }, '<')
    .to(heroImageWrapper, {
        borderRadius: '16px',
    }, '<')
    .add(() => {
        Flip.to(state, {
            duration: 2,
            ease: 'powe3.inOut'
        })
    }, '<')

    return tl;
}

const UIAnimation = () => {
    const tl = gsap.timeline({
        delay: .5,
        defaults: {
            ease: 'power3.out',
            duration: 1.7,
            yPercent: 0,
            y: 0,
        }
    });

    tl.to(heroCaption, {
        duration: 1.2,
        ease: 'power3.inOut'
    }, '-=0.9')
    .to(heroTitles, {
        stagger: .2, //stagger determina que a primeira linha do texto anima antes que a segunda
    }, .5)
    .to(heroButton, {
        autoAlpha: 1,
    }, '-= .9')
    .to(headerItems, {
        autoAlpha: 1,
    }, .5)

    return tl;
}

//podemos adiconar mais itens a nossa timeline depois
/*
basicamente dentro de algumas dessas funçoes nós criamos timelines 'locais' e retornamos elas pra ca, ai tem uma timeline MASTER que vale pra todo o funcionamento da animação, que contém timelines secundárias que determinam o comportamento de elementos.

A setInitialStates é utilizada para setar o estado inicial do elemento, pois isso é necessário para usar o translate. Obrigatoriedade do GSAP, não precisa entender 100%, só que é obrigatório.
A preloaderAnimation é uma timeline secundária
*/
master
    .add(setInitialStates())
    .add(preloaderAnimation())
    .add(heroImageAnimation(), '-=1.5')
    .add(UIAnimation(), '<')
