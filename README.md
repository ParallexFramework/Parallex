# Parallex

[Discord](https://discord.gg/gqgnAcJ)

Parallex is a fairly new JavaScript framework. Currently it only has a small bit of functionality. Feel free to create issues/pull requests if you want to contribute or contact me on Discord.

# Get Started

## Initialisation

Download and import the `parallex.js` file in your HTML,

    <script src='parallex.js'></script>
    
and initialise the Parallex object.

    var prl = Parallex;
      
## Select Your Container

To get started select your container element using the function returned from the Parallex initialisation.

    var container = prl('#container');
    
# Functionality

## Lists

To create a list in your container execute the `list` method containing the list array on the init object and pop an `in` method afterwards to specify which element gets repeated to contain the list items. Then `run` it all to execute everything.

    var fruits = ['Apple', 'Banana'];
    
    container.list(fruits).in('<span class='list-item'></span>').run();
    
<<<<<<< HEAD
The `in` method can contain a selector, an `HTMLElement` or `Node` object or even an HTML string. The output of the above would be something like the following,

    <your-container-element id='container'>
      <span class='list-item'>Apple</span>
      <span class='list-item'>Banana</span>
    </your-container-element>
    
The array is also reactive, meaning that when you update it, the HTML will also update. Let's push another fruit to the list,

    fruits.push('Orange');

As you can see the `fruits` array has been changed and so has the HTML content inside the container, adding the an orange to the list.
=======
>>>>>>> parent of d8cb0ee... Update README.md
    
