/*
 *  Name:           Antho_Alg.cpp (Anthony's Iteration Algorithm V1)
 *  Author:         Anthony Czerwinski
 *  Creation Date:  10/3/24
 *  Last Update:    10/5/24
 *  Description:    Anthony's first version of implementing the
 *                  iteration algoritm for the COSC 425 Graph
 *                  project, set up in AnthoBranch on the Github.
 *
 *                  Recieves a tuple variable of a relationship
 *                  from the graph that the java script file chooses
 *                  (data management file). The algorithm elaluates
 *                  the relationship and decides whether it will break or
 *                  not, and sends an updated tuple of the relationship back
 *                  to the java script.
 *
 *                  Note(s): Subject changes/modification others of the team when necessary.
 *                           This version was created without the webassembly set up
 *                           for this branch.
 *
 *                  Other Note(s): To update git branch, push changes for branch.
 */

#include <cstdlib>
// #include <algorithm>
// #include <cmath>
#include <tuple>

using namespace std;

/*
* Description: Recieves a tuple of two tuples and one float value.
*              Each tuple is of a node label and weight (tolerance).
*              The last float in the main tuple is the weight of the relationship
*              (relationship status).
*/

// template <class A, class B>
tuple<tuple<char, float>, tuple<char, float>, float> relation_eval(const tuple<tuple<char, float>, tuple<char, float>, float> rel)
{
    // Access each node
    auto node1 = get<0>(rel);
    auto node2 = get<1>(rel);
    // Set up each node tuple
    auto [label1, wgt1] = node1;
    auto [label2, wgt2] = node2;
    // Original Relationship Weight
    float relwgt = get<2>(rel);

    float relwgtnew;    // New relationship weight (0 or the same)
    float wgtdiff;      // Node weight difference

    if (wgt1 > wgt2)
        wgtdiff = wgt1 - wgt2;
    else if (wgt1 < wgt2)
        wgtdiff = wgt2 - wgt1;

    // Relationship is 0 (broken) if weight difference is greater than
    // original relationship weight.
    if (wgtdiff > relwgt)
        relwgtnew = 0;
    else
        relwgtnew = relwgt

    return make_tuple(node1, node2, relwgtnew);
}
